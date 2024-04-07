def load_user_data_into_table(db):
    table = db.Table("login")

    for number in range(10):
        email = f"s3906344{number}@student.rmit.edu.au"
        user_name = f"Anton Angelo Carasig{number}"
        password = "".join(str((number + i) % 10) for i in range(6))

        item = {
            "email": email,
            "user_name": user_name,
            "password": password,
        }

        response = table.put_item(Item=item)
        print(f"Item added: {response}")