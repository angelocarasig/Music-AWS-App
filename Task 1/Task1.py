import boto3
from CreateLoginTable import create_login_table
from LoadUserDataIntoTable import load_user_data_into_table
from CreateMusicTable import create_music_table
from LoadMusicDataIntoTable import load_music_data_into_table

AWS_REGION = "us-east-1"

if __name__=="__main__":

    db = boto3.resource("dynamodb", AWS_REGION)

    create_login_table(db)
    load_user_data_into_table(db)

    # create_music_table(db)
    # load_music_data_into_table(db)