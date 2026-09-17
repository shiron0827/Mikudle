import os
import mysql.connector
from dotenv import load_dotenv
from typing import cast

load_dotenv()
mydb = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"]
)
cursor = mydb.cursor()


def checkForOverlap(id: int):
    cursor.execute("SELECT 1 FROM usedSongs WHERE id = %s", (id,))
    records = cursor.fetchone()
    if records is not None:
        return False
    return True

def addSongToDb(id: int):
    cursor.execute("SELECT COUNT(*) FROM usedSongs")
    row = cursor.fetchone()

    if row is not None:
        count = int(cast(tuple, row)[0])
    else: count = 0

    if count >= 180:
        cursor.execute("TRUNCATE TABLE usedSongs")

    cursor.execute("INSERT INTO usedSongs (id) VALUES (%s)", (id,))

    mydb.commit()
    cursor.close()
    mydb.close()
    return True