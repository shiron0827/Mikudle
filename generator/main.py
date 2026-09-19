#PIPELINE
#vocadb (choose song / get info) -> youtube api (steal i mean stea i mean "borrow" song) ->
#audio-separator (UVR) -> mikudle

import song
import vocadb
import ytdlp
import stemseparator
import overlapDb
import bridge

def setup():
    songDict = vocadb.chooseSong()
    if songDict is None:
        raise RuntimeError("Failed to get song")

    names = vocadb.getNames(songDict["id"])
    if names is None:
        raise RuntimeError("Could not find names")

    ytUrl = vocadb.getUrl(songDict["id"])
    if ytUrl is None:
        raise RuntimeError("Could not find a YouTube PV")

    thumbUrl = vocadb.getThumbUrl(songDict["id"])
    if thumbUrl is None:
        raise RuntimeError("Could not find a YouTube PV")

    mp3Path = ytdlp.downloadMp3(ytUrl)
    if mp3Path is None:
        raise RuntimeError("Failed to download YouTube audio")

    tracks = stemseparator.splitSong(mp3Path)

    result = song.Song(
        songId = int(songDict["id"]),
        titles = names,
        youtubeUrl = ytUrl,
        thumbUrl = thumbUrl,
    )

    bridge.addSongDataToJson(result)

    return songDict["id"]

for i in range(20):
    try:
        id = setup()
    except Exception as e:
        print(f"Attempt {i + 1}/20 failed: {e}")
    else:
        overlapDb.addSongToDb(id)
        break