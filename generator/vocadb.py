import random
import requests
from datetime import datetime
import overlapDb

def chooseSong(selectionCount = 50):
    year = random.randint(2010, datetime.now().year)
    yearAfter = year + 1

    params = {
        "songTypes": "Original Song",

        "afterDate": f"{year}-01-01",
        "beforeDate": f"{yearAfter}-01-01",

        "tagName[]": ["karaoke available"],

        "onlyWithPvs": True,
        "pvServices": "Youtube",
        "maxResults": selectionCount,
        "getTotalCount": True,
        "sort": "RatingScore",
        "fields": "AdditionalNames",
        "lang": "Default"
    }

    response = requests.get("https://vocadb.net/api/songs", params=params)

    print(response.status_code)

    if response.status_code == 200:
        data = response.json()
        items = data["items"]

        if not items: return {}

        selection = random.randrange(len(items))

        for _ in range(50):
            song_id = items[selection]["id"]
            if overlapDb.checkForOverlap(song_id):
                return items[selection]
            selection = (selection + 1) % len(items)
        return {}

def getNames(id: int):
    params = {
            "id": id,
            "fields": "Names",
            "lang": "Default"
    }
    
    response = requests.get(f"https://vocadb.net/api/songs/{id}", params = params)
    
    if response.status_code == 200:
        data = response.json()
        titles = []
        for t in data["names"]:
            titles.append(t["value"])

        return titles

    else:
        return None

def getUrl(id: int):
    params = {
        "id": id,
        "fields": "PVs",
        "lang": "English"
    }

    response = requests.get(f"https://vocadb.net/api/songs/{id}", params = params)

    if response.status_code == 200:
        data = response.json()
        for dict in data["pvs"]:
            if dict["service"] == "Youtube":
                return dict["url"]
    else:
        return None

def getThumbUrl(id: int):
    params = {
        "id": id,
        "fields": "MainPicture",
        "lang": "English"
    }

    response = requests.get(f"https://vocadb.net/api/songs/{id}", params = params)

    if response.status_code == 200:
        data = response.json()
        return data["mainPicture"]["urlOriginal"]
    
    else:
        return None    