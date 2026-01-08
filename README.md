# Music Cutter

Десктопное приложение для вырезания фрагментов из MP3 аудиофайлов.

## Установка

### macOS

После скачивания .dmg файла возможно появится сообщение "Приложение повреждено и не может быть открыто".

**Способ 1:** Нажмите правой кнопкой мыши на приложении → выберите "Открыть" → нажмите "Открыть" в диалоговом окне.

**Способ 2:** Выполните в терминале:
```bash
xattr -cr /Applications/Music\ Cutter.app
```

Это происходит потому что приложение не подписано сертификатом Apple Developer.

### Windows

Скачайте и запустите `.exe` или `.msi` установщик.

## Стек технологий

- **Backend:** Rust + Tauri 2.x
- **Frontend:** React 19 + TypeScript + Vite + Chakra UI
- **Аудио обработка:** FFmpeg

## Разработка

```bash
npm run tauri dev
```

## Сборка

```bash
npm run tauri build
```

## IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
