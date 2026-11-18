## 🗺️ Introduction: an empty map

I had just uploaded a whole year of phone photos to my [Immich](https://immich.app/) server, the self-hosted alternative to Google Photos. The first thing I did, like everyone, was open the map to see my trips. And there was the gap: **not a single photo from the New York trip** (24 October to 8 November 2025). Almost two thousand photos and videos, all labelled *"no location"*.

The photos weren't lost. What was lost was **where** I took them.

> 💡 Spoiler: 1,855 of 1,928 photos (96%) went back on the map in about 30 seconds, without modifying a single original file. The key piece was something I had never looked at: my Google Maps Timeline history.

---

## 🤖 How I worked: iterating with agents

I didn't do this alone either. I worked in the terminal with AI agents (Claude Code) configured with [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), an open-source tool ([official site](https://gentle-ai.gentlemanprogramming.com/)) that sets up the agents you already use with persistent memory, Organic-Driven Development, skills and sub-agent orchestration, without locking you into any of them.

**What gentle-ai brought in this case:**

- **Engram:** persistent memory across sessions. The technical work happened in my server's session, and this post was written days later from another project, starting from the notes and results the agent had saved.
- **ODD (Organic-Driven Development):** a lightweight flow, with no commits or irreversible changes without my explicit permission.
- **Verification before action:** every step that touched real data started with a small, checkable test.

gentle-ai was created by [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming), and his rule for working with AI fits this whole post: *"verifying beats generating"*. Here, literally: before generating a single coordinate, we verified where the original one had been lost.

> ⭐ **gentle-ai on GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). If you find it useful, give it a star: it helps more people find it.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" height="95" loading="lazy" src="/assets/images/built-with-gentle-ai.webp" alt="Built with Gentle-AI" /></a></p>

The split was clear:

- 🤖 **The agent:** checked the photos' EXIF on the server, queried Immich's database, analysed the Timeline export format, wrote the matching script, set up the local server and sent the requests to the Immich API, first with 5 test photos and then in batches.
- 🙋 **Me:** checked the originals on the phone, exported the Timeline and copied it to the computer over USB, validated on the map that the samples landed where I remembered, and gave the go-ahead for every step that modified data.

---

## 🔍 Diagnosis: where was the data lost?

Before fixing anything, I wanted to know **at which point** the location had disappeared. There are two reasonable suspects:

1. **The upload.** Since Android 10, the system strips GPS coordinates from files handed to apps that lack the *media location access* permission. If the upload app doesn't have it, photos reach the server "clean".
2. **The camera.** GPS was never saved in the first place.

I checked 50 random photos from October and November 2025 on the server with `exiftool`: **0 of 50 had GPS**. Camera model, date and timezone, on the other hand, were intact.

Then I looked at the originals on the phone itself (Gallery → details): **no location either**. Case closed: it wasn't the upload, the camera never wrote GPS. On a OnePlus the usual causes are the camera's *"save location"* toggle being off (some OxygenOS updates reset it), the camera app lacking location permission (it fails silently), or location being off during the trip.

> ⚠️ If your photos do have GPS on the phone but not on the server, it's the other problem: check the media location permission of the app that uploads them.

---

## 💡 The idea: the phone did know where I was

The camera didn't save the location, but **the phone did record it**. Google Maps Timeline had the whole trip: every visit, every walk, every ferry.

So the plan was simple to state: for each photo, take its exact time and ask the Timeline **where I was at that moment**.

---

## 📤 Step 1: check and export the Timeline

Since 2024, Timeline **is stored on the device**, not in the cloud. That has two important consequences:

- **Check it first:** Google Maps → your profile → *Your timeline* → calendar → pick a day of the trip. If you see the routes, the data is there.
- **Turn off auto-delete before anything else.** Timeline settings have an *auto-delete* option that often defaults to 3 months on new accounts. I turned it off before touching anything else.

To export it: **Android Settings → Location → Location services → Timeline → Export Timeline data**. The result was a **19 MB** JSON file.

> 🔒 Mind the privacy: that file is **your complete location history**. I copied it to the computer over USB, set `chmod 600` on it and never sent it through chat or email.

---

## 🧬 Step 2: understand the format

The JSON has three main keys: `semanticSegments`, `rawSignals` and `userLocationProfile`. The first two are the ones that matter:

- **`semanticSegments`** (10,760 in my case) contain:
  - **`visit`**: a place you stayed at, with start and end time and its `placeLocation.latLng`.
  - **`timelinePath`**: a list of `{ point, time }` points while you were moving.
  - **`activity`**: movement segments.
- **`rawSignals`** (24,408): raw positions with `timestamp` and `LatLng`.

A curious detail: coordinates come as text, degree sign included:

```json
{ "point": "40.7529°, -73.9785°", "time": "2025-10-27T15:42:00.000-04:00" }
```

Coverage was good: between 58 and 117 points per trip day. Just averaging positions per day draws the trip: the New York days cluster around `40.76, -74.01`, and the flight back averages out in the middle of the Atlantic. 🛫

---

## 🕐 Step 3: each photo's time (in UTC)

This is the step that decides whether everything works or not. The EXIF field `DateTimeOriginal` stores **local** time, but the Timeline works with absolute instants. To match them you need UTC.

Luckily, my OnePlus also writes **`OffsetTimeOriginal`** (`+01:00`, `+02:00`, `-04:00`...), so the conversion to UTC is exact. Without that field you would have to guess each day's timezone, and on a trip with a time change that's a sure source of errors.

I pulled from Immich's database the list of assets in the trip period (id, file name and UTC time): **1,971 assets, 1,928 without GPS**.

---

## 🧮 Step 4: the matching algorithm

For each photo with time `t` (UTC), in this order:

1. If `t` falls **inside a visit** → use that place's location.
2. Otherwise, take the path points just before and just after `t`. If they are **30 minutes or less** apart → **linear interpolation** between them.
3. Otherwise, the **nearest point**, as long as it is **60 minutes or less** away.
4. Otherwise → **leave it without location**. I'd rather have a gap than invented data.

The whole script fits in about 60 lines of dependency-free Python:

```python
import json, sys, bisect
from datetime import datetime, timezone

def parse_t(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)

def parse_ll(s):
    a, b = s.replace("°", "").replace("geo:", "").split(",")
    return float(a), float(b)

timeline = json.load(open(sys.argv[1]))
points, visits = [], []
for seg in timeline["semanticSegments"]:
    for p in seg.get("timelinePath", []):
        points.append((parse_t(p["time"]), *parse_ll(p["point"])))
    v = seg.get("visit")
    if v:
        la, lo = parse_ll(v["topCandidate"]["placeLocation"]["latLng"])
        visits.append((parse_t(seg["startTime"]), parse_t(seg["endTime"]), la, lo))
for r in timeline.get("rawSignals", []):
    pos = r.get("position")
    if pos and "LatLng" in pos and "timestamp" in pos:
        points.append((parse_t(pos["timestamp"]), *parse_ll(pos["LatLng"])))
points.sort()
times = [p[0] for p in points]

def locate(t):
    for start, end, la, lo in visits:
        if start <= t <= end:
            return la, lo, "visit"
    i = bisect.bisect_left(times, t)
    before = points[i - 1] if i > 0 else None
    after = points[i] if i < len(points) else None
    if before and after:
        gap = (after[0] - before[0]).total_seconds()
        if gap <= 30 * 60:
            f = 0 if gap == 0 else (t - before[0]).total_seconds() / gap
            return (before[1] + f * (after[1] - before[1]),
                    before[2] + f * (after[2] - before[2]), "interp")
    best = min((p for p in (before, after) if p),
               key=lambda p: abs((p[0] - t).total_seconds()))
    if abs((best[0] - t).total_seconds()) <= 60 * 60:
        return best[1], best[2], "nearest"
    return None
```

The input is two files: the Timeline export and an `id|name|utc_time|zone|latitude` listing of the assets. The output is a JSON file with the coordinate and the method used for each photo, which let me review the results before applying anything.

---

## ✍️ Step 5: apply the location without touching the originals

I had two options: rewrite the files' EXIF or tell Immich the location. I chose the second, using its API:

```http
PUT /api/assets/{id}
Content-Type: application/json

{ "latitude": 40.758, "longitude": -73.9855 }
```

It's exactly what the web UI does with *"Edit location"*, but in bulk. Advantages:

- **The originals stay untouched** and the change is reversible.
- **No duplicates.** Had I retagged the files on the phone, their checksum would change and the Immich app would upload them again as new photos.

In the end I didn't even need an API key: I sent the requests from a browser tab with the Immich session logged in. The matched data was served by a tiny HTTP server on `localhost` (with CORS and the `Access-Control-Allow-Private-Network` header), so the coordinates never went anywhere else.

And I went carefully:

- **First 5 test photos**, checked one by one on the map.
- Then the rest **in batches of 400**, with 4 parallel requests.
- Skipping any asset that already had a latitude, so nothing got overwritten.

---

## 📊 Results

| Method | Photos |
|---|---|
| Inside a visit | 991 |
| Interpolation (≤ 30 min) | 805 |
| Nearest point (≤ 60 min) | 59 |
| No data | 73 |

**1,855 of 1,928 photos (96%) got their location back**, in about 30 seconds and with **0 failures**. The remaining 73 are from the evening of the outbound flight: the Timeline has no points at 10,000 metres, and they were left empty on purpose.

I checked random samples against places I remembered: Times Square, the Financial District, the Statue of Liberty and Grand Central, where a photo and a video taken 30 minutes apart landed in the same visit. Everything matched.

<img src="/assets/images/blog/googleTimelineGps/map-after.webp" srcset="/assets/images/blog/googleTimelineGps/map-after-800.webp 800w, /assets/images/blog/googleTimelineGps/map-after.webp 1600w" sizes="(min-width: 1100px) 920px, min(100vw - 3rem, 752px)" loading="lazy" alt="Immich map with New York and its surroundings full of photo clusters after restoring the locations">

A quirk for Immich users: reverse geocoding names each place after the **nearest city** in its database (GeoNames), so a Times Square photo shows up as *"Weehawken"*, across the river. The pin is right; only the name is misleading.

---

## 🔁 Second pass: the whole library

If it worked for New York, why not for everything else? I repeated the process with **every camera photo without GPS since September 2024**, which is when my Timeline starts.

With one important filter: **I excluded assets without a camera model in the EXIF** (screenshots, downloads). Tagging a screenshot with *"where I was when I took it"* is fake data, not recovered data.

- 1,052 candidates → 679 by visit, 134 interpolated, 93 by nearest point and 146 with no data.
- **906 recovered (86%)** in 14 seconds, with no failures.

Grouping the results by day and computing each group's centre gave a quick review of the last year's trips: Serra da Estrela, Lisbon, Guarda, Madrid, Cáceres, Évora, two getaways to the Algarve...

---

## 🌅 The final twist: the trip I didn't remember

And then something I didn't expect showed up. Between 14 and 16 September 2024, the Timeline placed me **in the Algarve**. I didn't remember that weekend. The Timeline did: it was right before Serra da Estrela (17–20 September), and the photos confirmed it.

---

## 🧠 Lessons

- **Find out where the data is lost before fixing it.** Comparing the server copy with the phone original told me the problem was the camera, not the upload.
- **The EXIF timezone is everything.** With `OffsetTimeOriginal` the match is exact; without it, it's a gamble.
- **Conservative thresholds.** Better to leave 73 photos without location than to drop 73 fake pins.
- **Don't retag the originals if you use a photo server.** The checksum changes and you'll end up with duplicates.
- **Export your Timeline early.** It now lives on the device and can delete itself.
- **Check today that your camera saves location.** Take a photo, look at its details and spare yourself this post. 📸
