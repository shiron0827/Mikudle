import os
import yt_dlp

def clearSongsFolder():
    folder = "songs"

    os.makedirs(folder, exist_ok=True)

    for filename in os.listdir(folder):
        path = os.path.join(folder, filename)

        if os.path.isfile(path):
            os.remove(path)


def downloadMp3(url: str) -> str:
    clearSongsFolder()

    runner_temp = os.environ.get("RUNNER_TEMP")

    opts = {
        "format": "bestaudio/best",
        "outtmpl": "../public/songs/tomorrow/fullsong.%(ext)s",
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