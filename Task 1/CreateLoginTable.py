def create_login_table(db):
    try:
        print("Creating table 'login'...")
        music_table = db.create_table(
            TableName="music",
            KeySchema=[
                {
                    "AttributeName": "email",
                    "KeyType": "HASH",
                }
            ],
            AttributeDefinitions=[
                {
                    "AttributeName": "email",
                    "AttributeType": "S",
                },
                {
                    "AttributeName": "user_name",
                    "AttributeType": "S",
                },
                {
                    "AttributeName": "password",
                    "AttributeType": "S",
                },
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )
        music_table.wait_until_exists()
        print("Table 'login' created.")
    except:
        print("An exception occurred.")
