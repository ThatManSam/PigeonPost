import json
import boto3
import decimal


# Initialize DynamoDB clients for both tables
dynamodb_messages = boto3.resource('dynamodb').Table('message')
dynamodb_locations = boto3.resource('dynamodb').Table('locations')

def convert_decimal_to_float(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    elif isinstance(obj, list):
        return [convert_decimal_to_float(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_decimal_to_float(value) for key, value in obj.items()}
    else:
        return obj

def lambda_handler(event, context):
    headers = {
        'Content-type': 'application/json'
    }
    
    try:
        # Extract the message ID from the URL path
        message_id = event['pathParameters']['id']

        # Define the hardcoded name to match against senderName or receiverName
        hardcoded_name = "John Doe"  # Replace with your hardcoded name

        # Check if a message with the given ID exists for the hardcoded name
        message_response = dynamodb_messages.query(
            KeyConditionExpression='message_id = :mid',
            ExpressionAttributeValues={
                ':mid': message_id
            }
        )

        messages = message_response.get('Items')
        match = False
        for message in messages:
            if message['senderName'] == hardcoded_name or message['receiverName'] == hardcoded_name:
                match = True
                break

        # If a matching message is found
        if match:
            # Query the locations table directly using message_id
            locations_response = dynamodb_locations.query(
                KeyConditionExpression='message_id = :mid',
                ExpressionAttributeValues={
                    ':mid': message_id
                }
            )

            # Extract and return the matching locations
            matching_locations = locations_response.get('Items', [])
            matching_locations = convert_decimal_to_float(matching_locations)
            
            if not matching_locations:
                return {
                    'statusCode': 202,
                    'headers': headers,
                    'body': json.dumps('Locations are still being calculated.')
                }

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(matching_locations[0]['locations'])
            }
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps('Message not found or unauthorized.')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(str(e))
        }
