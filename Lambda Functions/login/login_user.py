import json
import boto3
import re
from botocore.exceptions import ClientError

# Helper function to create standardized responses
def create_response(status_code, body):
    return {
        "statusCode": status_code,
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
        
        email_validator = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.fullmatch(email_validator, email):
            return create_response(400, {"message": "email format is not valid."})
        
        password = body.get("password")
        if not password:
            return create_response(400, {"message": "password could not be found in the payload."})

    except json.JSONDecodeError:
        return create_response(400, {"message": "Request body is not valid JSON."})

    try:
        response = table.get_item(Key={"email": email})
        item = response.get("Item")
        if not item:
            return create_response(404, {"message": "User with the provided email does not exist."})
        
        if item["password"] == password:
            return create_response(200, {"message": "Login successful."})
        else:
            return create_response(401, {"message": "The password is incorrect."})

    except ClientError as e:
        print(e)
        return create_response(500, {"message": "An error occurred during database operation."})
