import os
import mysql.connector
from dotenv import load_dotenv
from typing import cast
import flask
from flask_cors import CORS
import json
from song import Song

load_dotenv()
mydb = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"]
)
cursor = mydb.cursor()

app = flask.Flask(__name__)
CORS(app)

def addSongDataToDb(data: Song):
    cursor.execute("TRUNCATE TABLE songData")
    cursor.execute("""
        INSERT INTO songData
            (songId, titles, youtubeUrl, thumbUrl)
        VALUES
            (%s, %s, %s, %s)
    """, (
        data["songId"],
        json.dumps(data["titles"]),
        data["youtubeUrl"],
        data["thumbUrl"]
    ))
    mydb.commit()

@app.route("/api/song")
def get_song():
    cursor.execute("""
        SELECT songId, titles, youtubeUrl, thumbUrl
        FROM songData
        LIMIT 1;
    """)

    row = cursor.fetchone()

    if row is None:
        return flask.jsonify({"error": "No songs found"}), 404

    songId, titles, youtubeUrl, thumbUrl = row

    if isinstance(titles, str):
        titles = json.loads(titles)

    return flask.jsonify({
        "songId": songId,
        "titles": titles,
        "youtubeUrl": youtubeUrl,
        "thumbUrl": thumbUrl
    })

if __name__ == "__main__":
    app.run(port=5000)