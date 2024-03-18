import json
import os

def load_data_into_table(db):
  table = db.Table('music')
  directory = os.path.dirname(os.path.realpath(__file__))

  with open(f'{directory}/a1.json', 'r') as f:
    data = json.load(f)
    print("Adding Items:")

    for item in data['songs']:
      print(f"{item['title']} | {item['artist']} | {item['year']}")

      response = table.put_item(Item=item)
      print(f"Item added: {response}")
  