import os
from pathlib import Path
import yt_dlp

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "songs" / "tomorrow"

def clearSongsFolder():
    for path in OUTPUT_DIR.iterdir():
        if path.is_file():
            path.unlink()


def downloadMp3(url: str) -> str:
    runner_temp = os.environ.get("RUNNER_TEMP")

    opts = {
        "format": "bestaudio/best",
        "outtmpl": str(OUTPUT_DIR / "fullsong.%(ext)s"),
        "remote_components": ["ejs:npm"],
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "verbose": True,
    }

    if runner_temp:
        cookie_file = os.path.join(runner_temp, "cookies.txt")

        if os.path.isfile(cookie_file):
            opts["cookiefile"] = cookie_file

    with yt_dlp.YoutubeDL(opts) as ydl:  # type: ignore
        info = ydl.extract_info(url, download=True)

        filename = ydl.prepare_filename(info)
        mp3_path = os.path.splitext(filename)[0] + ".mp3"

        return mp3_path