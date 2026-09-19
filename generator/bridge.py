import json
from pathlib import Path
from song import Song


def addSongDataToJson(data: Song):
    song_data = {
        "songId": data["songId"],
        "titles": data["titles"],
        "youtubeUrl": data["youtubeUrl"],
        "thumbUrl": data["thumbUrl"]
    }

    with open("../public/songs/tomorrow/songData.json", "w", encoding="utf-8") as file:
        json.dump(song_data, file, ensure_ascii=False, indent=4)