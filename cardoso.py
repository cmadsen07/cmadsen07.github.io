import pandas as pd
import json

# READ SHEET

SHEET_ID = "1uPeHEsseec9oD0k938bBKhZ0Mu1RpjhQJ5ijVJlwRdg"
SHEET_NAME = "Sheet1"

url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}'
df = pd.read_csv(url)
time = 0
for i in range(0, len(df)):
    time += df.loc[i][1]*60

day = time // (24 * 3600)
time = time % (24 * 3600)
hour = time // 3600
time %= 3600
minutes = time // 60

# generate hugo json data
export_json = {
    "days": str(day),
    "hours": str(hour),
    "minutes": str(minutes)
}

json_object = json.dumps(export_json, indent=4)
with open("data/time_track.json", "w") as outfile:
    outfile.write(json_object)

print(day)
print(hour)
print(minutes)