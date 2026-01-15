const fs = require('fs');
const { execSync } = require('child_process');

const tag = process.env.TAG_NAME;
const releaseBody = process.env.RELEASE_BODY || '';

const extensions = ['\\.dmg$', '\\.exe$', '\\.appimage$'];
let assetsList = [];

extensions.forEach(ext => {
  const releaseData = execSync(`gh release view ${tag} --json assets,body -q ".assets[] | select(.name | test("${ext}")) | {name: .name, url: .browser_download_url}"`, { encoding: 'utf8' });
  const lines = releaseData.trim().split('\n').filter(Boolean).map(line => {
    const match = line.match(/\{[^}]+\}/);
    return match ? JSON.parse(match[0]) : null;
  }).filter(Boolean);
  assetsList = assetsList.concat(lines);
});

const pkg = require('./package.json');
const latest = {
  version: pkg.version,
  body: releaseBody,
  date: new Date().toISOString(),
  platforms: {}
};

assetsList.forEach(asset => {
  const name = asset.name;
  const url = asset.url;

  if (name.endsWith('.dmg')) {
    if (name.includes('aarch64') || name.includes('arm64')) {
      latest.platforms['darwin-aarch64'] = [{ url }];
    } else if (name.includes('x64') || name.includes('x86_64')) {
      latest.platforms['darwin-x86_64'] = [{ url }];
    }
  } else if (name.endsWith('.exe')) {
    latest.platforms['windows-x86_64'] = [{ url }];
  } else if (name.endsWith('.appimage')) {
    latest.platforms['linux-x86_64'] = [{ url }];
  }
});

fs.writeFileSync('latest.json', JSON.stringify(latest, null, 2));
console.log('Generated latest.json with release notes');
