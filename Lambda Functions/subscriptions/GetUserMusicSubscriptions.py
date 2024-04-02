import json
import boto3
import re
from botocore.exceptions import ClientError


def create_response(status_code, body):
    """ "
    Returns a http response with CORS headers

    Parameters:
    - status_code (int): HTTP status code of the response.
    - body (dict): the body content to be serialized in json.

    Returns:
    - dict: An object for the formatted HTTP response with keys for 'statusCode', 'headers', and 'body'.
    """
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    }

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body),
    }


def decode_music_string(music_string):
    """
    Returns a music string destructured into its title and artist components.

    Parameters:
    - music_string: string in the format 'title-artist-year' to be destructured.

    Returns:
    - { title: string, artist: string, year: string }
    """
    parts = music_string.replace("_", " ").split("-")

    return {"title": parts[0], "artist": parts[1], "year": parts[2]}


# NOTE: This function's timeout has currently been set to 30s (originally 3s)
def lambda_handler(event, context):
    db = boto3.resource("dynamodb", region_name="us-east-1")
    table = db.Table("subscriptions")

    email = event.get("queryStringParameters", {}).get("email")

    if not email:
        return create_response(
            400, {"message": "email could not be found in the payload."}
        )
    email_validator = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
    if not re.fullmatch(email_validator, email):
        return create_response(400, {"message": "email format is not valid."})

    try:
        response = table.query(
            KeyConditionExpression="email = :email",
            ExpressionAttributeValues={":email": email},
        )
        items = response.get("Items")
        if not items:
            return create_response(200, items)
        
        # Returns {"email": "...", "music": "item"}
        # Format first so its an array of music item strings
        # Then call music db and return array of music items from the given strings

        items = [item["music"] for item in items if "music" in item]
        destructured_items = [decode_music_string(item) for item in items]

        # Keys to pass into boto3 client batch_get_item request
        # Only need title and artist as partition and sort keys
        keys = [
            {"title": {"S": f"{item['title']}"}, "artist": {"S": f"{item['artist']}"}}
            for item in destructured_items
        ]

        db_client = boto3.client("dynamodb", region_name="us-east-1")

        requestItems = {"music": {"Keys": keys}}

        response = db_client.batch_get_item(RequestItems=requestItems)
        response_items = response["Responses"]["music"]
        return create_response(200, response_items)

    except ClientError as e:
        return create_response(500, {"message": e.message})
