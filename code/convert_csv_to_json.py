import csv
import json

csv_file_path = '/Users/abzalyessengazy/Desktop/ScrapingTool/Git/Baqylau/Data/V_MAIN_UNFILTERED_PUBLISHED.csv'
json_file_path = '/Users/abzalyessengazy/Desktop/ScrapingTool/Git/Baqylau/Data/V_MAIN_UNFILTERED_PUBLISHED.json'

with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data = list(csv_reader)

with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=2)
