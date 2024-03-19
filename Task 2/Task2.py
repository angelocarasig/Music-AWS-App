import boto3

from DownloadImages import download_images
from UploadImages import upload_images

AWS_REGION = "us-east-1"
BUCKET_NAME = "s3906344-cosc2626-a1-music"

if __name__ == "__main__":
    s3 = boto3.client("s3", region_name=AWS_REGION)

    download_images()
    upload_images(s3, BUCKET_NAME)