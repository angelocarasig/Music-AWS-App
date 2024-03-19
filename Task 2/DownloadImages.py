import requests
import os
import json

def download_images():
    directory = os.path.dirname(os.path.realpath(__file__))

    with open(f'{directory}/a1.json', 'r') as f:
        json_data = json.load(f)

        for item in json_data['songs']:
            filename = f"{item['title']} - {item['artist']}{item['year']}.jpg".replace(" ", "_")
            file_directory = f"{directory}/images/{filename}"

            response = requests.get(item["img_url"])
            if response.status_code == 200:
                with open(file_directory, "wb") as file:
                    file.write(response.content)
                print(f"Image successfully downloaded and saved as {file_directory}")
            else:
                print(f"Failed to download the image. Status code: {response.status_code}")
