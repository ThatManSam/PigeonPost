import json
import boto3
import decimal
import base64

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

def get_user_from_jwt(token):
    try:
        # Split the JWT into its parts (header, payload, signature)
        _, payload_encoded, _ = token.split('.')

        # Decode the base64-encoded header and payload
        payload = json.loads(base64.urlsafe_b64decode(payload_encoded + '==').decode('utf-8'))

        if 'email' in payload.keys():
            return payload['email']
        raise ValueError("Missing email in token")
        
    except Exception:
        return None

def lambda_handler(event, context):
    headers = {
        'Content-type': 'application/json'
    }
    
    try:
        # Extract the message ID from the URL path
        message_id = event['pathParameters']['id']

        # Get the name to match against senderName or receiverName
        if 'authorization' in event['headers'].keys():
            name = get_user_from_jwt(event['headers']['authorization'])
        else:
            raise ValueError("Missing authorization header")
            
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
            if message['senderName'] == name or message['receiverName'] == name:
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
