
import json
from pathlib import Path

DB_FILE = Path(__file__).resolve().parent / "usedSongs.json"


def loadSongs() -> list[int]:
    if not DB_FILE.exists():
        return []

    with DB_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def saveSongs(songs: list[int]) -> None:
    with DB_FILE.open("w", encoding="utf-8") as file:
        json.dump(songs, file, indent=2)


def checkForOverlap(id: int) -> bool:
    songs = loadSongs()
    return id not in songs


def addSongToDb(id: int) -> bool:
    songs = loadSongs()

    if id in songs:
        return False

    if len(songs) >= 180:
        songs = []

    songs.append(id)
    saveSongs(songs)
    return True