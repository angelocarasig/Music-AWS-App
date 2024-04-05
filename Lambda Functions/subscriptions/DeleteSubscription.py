import json
import boto3
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
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
    }

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body),
    }

def encode_music_string(title, artist, year):
    """
    Generates a music string from its title and artist components.

    Parameters:
    - title: string
    - artist: string
    - year: string | number | date
    
    Returns:
    - `title-artist-year`
    """
    return f"{title.lower().replace(' ', '_')}-{artist.lower().replace(' ', '_')}-{year}"

def lambda_handler(event, context):
    # Check if the event body needs to be parsed from JSON
    if 'body' in event:
        try:
            event = json.loads(event['body'])
        except json.JSONDecodeError:
            return create_response(400, {"message": "Invalid JSON in request body"})
    
    db = boto3.resource("dynamodb", region_name="us-east-1")
    table = db.Table("subscriptions")

    user_required_props = ["email"]
    music_required_props = ["title", "artist", "year"]

    # Verify if present
    try:
        if all(prop in event.get("user", {}) for prop in user_required_props) and all(prop in event.get("music", {}) for prop in music_required_props):
            music_string = encode_music_string(
                                event['music']['title'],
                                event['music']['artist'],
                                event['music']['year']
                            )
            # Deleting the item
            table.delete_item(
                Key={
                    "email": event['user']['email'],
                    "music": music_string,
                }
            )
            return create_response(200, {"message": "Subscription successfully deleted"})
        else:
            return create_response(400, {"message": "Some required properties in the payload are missing."})
    except ClientError as e:
        return create_response(400, {"message": f"An error occurred: {str(e)}"})

