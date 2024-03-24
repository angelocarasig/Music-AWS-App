import json
import boto3
import re
from botocore.exceptions import ClientError

# New function to create responses with CORS headers
def create_response(status_code, body, extra_headers=None):
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    }
    if extra_headers:
        headers.update(extra_headers)

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body),
    }

def lambda_handler(event, context):
    db = boto3.resource("dynamodb", region_name="us-east-1")
    table = db.Table("login")

    try:
        body = json.loads(event.get("body", ""))
        email = body.get("email")
        if not email:
            return create_response(400, {"message": "email could not be found in the payload."})
        
        email_validator = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
        if not (re.fullmatch(email_validator, email)):
            return create_response(400, {"message": "email format is not valid."})

        user_name = body.get("user_name")
        if not user_name:
            return create_response(400, {"message": "user_name could not be found in the payload."})
        if len(user_name) < 6:
            return create_response(400, {"message": "user_name is less than 6 characters."})

        password = body.get("password")
        if not password:
            return create_response(400, {"message": "password could not be found in the payload."})
        if len(password) < 6:
            return create_response(400, {"message": "password is less than 6 characters."})
    except json.JSONDecodeError:
        return create_response(400, {"message": "Request body is not valid JSON."})

    try:
        response = table.get_item(Key={"email": email})
        if "Item" in response:
            return create_response(400, {"message": "User already exists."})
    except ClientError as e:
        print(e)
        return create_response(500, {"message": "An error occurred during database operation."})

    try:
        table.put_item(Item={"email": email, "user_name": user_name, "password": password})
        return create_response(201, {"message": "User created successfully."})
    except ClientError as e:
        print(e)
        return create_response(500, {"message": "An error occurred during database operation."})
