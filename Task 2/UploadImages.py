import os
from botocore.exceptions import ClientError
import logging

def upload_images(s3, bucket_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    downloaded_images_folder = os.path.join(current_dir, "images")

    files = [file for file in os.listdir(downloaded_images_folder) if file.endswith('jpg')]

    for file in files:
        file_dir = os.path.join(downloaded_images_folder, file)
        
        try:
            s3.upload_file(file_dir, bucket_name, file)
            print(f"Uploaded file '{file}'...")
        except ClientError as e:
            logging.error(e)