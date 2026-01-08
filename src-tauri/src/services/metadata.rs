use crate::types::{MetadataInput, MetadataOutput};
use base64::{Engine as _, engine::general_purpose};
use id3::{Tag, Version};
use std::path::Path;

pub fn read_metadata(file_path: &str) -> Result<MetadataOutput, String> {
    let path = Path::new(file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    let tag = Tag::read_from_path(path)
        .map_err(|e| format!("Failed to read metadata: {}", e))?;

    let title = tag.title().map(String::from);
    let artist = tag.artist().map(String::from);
    let album = tag.album().map(String::from);

    let album_artist = tag
        .get("TPE2")
        .and_then(|frame| frame.content().text())
        .map(String::from);

    let composer = tag
        .get("TCOM")
        .and_then(|frame| frame.content().text())
        .map(String::from);

    let genre = tag.genre().map(String::from);
    let year = tag.year().map(|y| y as u32);
    let comment = tag.comments().next().map(|c| c.text.clone());

    let track_number = tag.track();
    let disc_number = tag.disc();

    let is_compilation = tag
        .get("TCMP")
        .and_then(|frame| frame.content().text())
        .map(|t| t == "1")
        .unwrap_or(false);

    let cover_image_data = tag
        .pictures()
        .next()
        .map(data_url_from_picture);

    Ok(MetadataOutput {
        title,
        artist,
        album,
        album_artist,
        composer,
        genre,
        year,
        track_number,
        total_tracks: None,
        disc_number,
        total_discs: None,
        is_compilation,
        cover_image_data,
        comment,
    })
}

pub fn write_metadata(input: &MetadataInput) -> Result<(), String> {
    let path = Path::new(&input.file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", input.file_path));
    }

    let mut tag = Tag::read_from_path(path).unwrap_or_else(|_| Tag::new());

    if let Some(ref title) = input.title {
        tag.set_title(title);
    }

    if let Some(ref artist) = input.artist {
        tag.set_artist(artist);
    }

    if let Some(ref album) = input.album {
        tag.set_album(album);
    }

    if let Some(ref album_artist) = input.album_artist {
        tag.set_text("TPE2", album_artist);
    }

    if let Some(ref composer) = input.composer {
        tag.set_text("TCOM", composer);
    }

    if let Some(ref genre) = input.genre {
        tag.set_genre(genre);
    }

    if let Some(year) = input.year {
        tag.set_year(year as i32);
    }

    if let Some(track) = input.track_number {
        tag.set_track(track);
    }

    if let Some(disc) = input.disc_number {
        tag.set_disc(disc);
    }

    if let Some(is_compilation) = input.is_compilation {
        let value = if is_compilation { "1" } else { "0" };
        tag.set_text("TCMP", value);
    }

    if let Some(ref comment) = input.comment {
        tag.add_comment(id3::frame::Comment {
            lang: "eng".to_string(),
            description: "".to_string(),
            text: comment.clone(),
        });
    }

    if let Some(ref cover_data) = input.cover_image_data {
        if let Some((mime_type, data)) = parse_data_url(cover_data) {
            tag.add_picture(id3::frame::Picture {
                mime_type,
                picture_type: id3::frame::PictureType::CoverFront,
                description: "".to_string(),
                data,
            });
        }
    }

    tag.write_to_path(path, Version::Id3v24)
        .map_err(|e| format!("Failed to write metadata: {}", e))?;

    Ok(())
}

fn data_url_from_picture(picture: &id3::frame::Picture) -> String {
    format!(
        "data:{};base64,{}",
        picture.mime_type,
        general_purpose::STANDARD.encode(&picture.data)
    )
}

fn parse_data_url(url: &str) -> Option<(String, Vec<u8>)> {
    let url = url.strip_prefix("data:")?;
    let parts: Vec<&str> = url.splitn(2, ';').collect();

    if parts.len() != 2 {
        return None;
    }

    let mime_type = parts[0].to_string();
    let rest = parts[1];

    if let Some(base64_data) = rest.strip_prefix("base64,") {
        let data = general_purpose::STANDARD.decode(base64_data).ok()?;
        return Some((mime_type, data));
    }

    None
}
