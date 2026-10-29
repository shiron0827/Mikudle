import json
from pathlib import Path
from song import Song

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "songs" / "tomorrow"
OUTPUT_FILE = OUTPUT_DIR / "songData.json"


def addSongDataToJson(data: Song):
    song_data = {
        "songId": data["songId"],
        "titles": data["titles"],
        "youtubeUrl": data["youtubeUrl"],
        "thumbUrl": data["thumbUrl"]
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with OUTPUT_FILE.open("w", encoding="utf-8") as file:
        json.dump(song_data, file, ensure_ascii=False, indent=4)