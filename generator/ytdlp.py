import os
import yt_dlp

def clearSongsFolder():
    folder = "songs"

    os.makedirs(folder, exist_ok=True)

    for filename in os.listdir(folder):
        os.remove(os.path.join(folder, filename))

def downloadMp3(url: str) -> str:
    clearSongsFolder()

    opts = {
        "format": "bestaudio/best",
        "outtmpl": "../public/songs/tomorrow/fullsong.%(ext)s",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "verbose": True,
    }

    with yt_dlp.YoutubeDL(opts) as ydl: # type: ignore
        info = ydl.extract_info(url, download=True)

        filename = ydl.prepare_filename(info)
        mp3_path = os.path.splitext(filename)[0] + ".mp3"

        return mp3_path 