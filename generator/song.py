from dataclasses import dataclass
from typing import TypedDict

@dataclass
class Song(TypedDict):
    songId: int
    titles: list[str]
    youtubeUrl: str
    thumbUrl: str