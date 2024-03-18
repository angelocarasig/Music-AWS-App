import boto3
from CreateMusicTable import create_music_table
from LoadDataIntoTable import load_data_into_table

AWS_REGION = "us-east-1"

if __name__=="__main__":

    db = boto3.resource("dynamodb", AWS_REGION)

    create_music_table(db)
    load_data_into_table(db)