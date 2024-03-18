def create_music_table(db):
    try:
        print("Creating table 'music'...")
        music_table = db.create_table(
            TableName="music",
            KeySchema=[
                {
                    "AttributeName": "title",
                    "KeyType": "HASH",
                },
                {
                    "AttributeName": "artist",
                    "KeyType": "RANGE",
                },
            ],
            AttributeDefinitions=[
                {
                    "AttributeName": "title",
                    "AttributeType": "S",
                },
                {
                    "AttributeName": "artist",
                    "AttributeType": "S",
                },
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )
        music_table.wait_until_exists()
        print("Table 'music' created.")
    except:
        print("An exception occurred.")
