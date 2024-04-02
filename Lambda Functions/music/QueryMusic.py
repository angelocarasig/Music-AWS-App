import json
import boto3
from botocore.exceptions import ClientError


def create_response(status_code, body):
    """Returns a HTTP response with CORS headers.

    Parameters:
    - status_code (int): HTTP status code of the response.
    - body (dict): The body content to be serialized in JSON.

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


def lambda_handler(event, context):
    try:
        json_body = json.loads(event["body"]) if "body" in event else {}
    except json.JSONDecodeError:
        return create_response(400, {"message": "Request body is not valid JSON."})

    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("music")

    # Generate filter expression
    filter_parts = []
    expression_attribute_values = {}
    expression_attribute_names = {}

    for attribute in ["title", "year", "artist"]:
        if attribute in json_body:
            filter_parts.append(f"#{attribute} = :{attribute}")
            expression_attribute_values[f":{attribute}"] = json_body[attribute]
            expression_attribute_names[f"#{attribute}"] = attribute

    # By default filter assumes AND operator
    filter_expression = " AND ".join(filter_parts)

    try:
        # If no expressions return the table items.
        if not expression_attribute_names:
            response = table.scan()
        # Otherwise return the filtered
        else:
            response = table.scan(
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ExpressionAttributeNames=expression_attribute_names,
            )
    except ClientError as e:
        print(e)
        return create_response(500, {"message": "An error occurred during database operation."})

    items = response["Items"]

    return create_response(200, {"message": "Received the following results.", "body": items})
