import json
import boto3
import base64

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('message')

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
        if 'authorization' in event['headers'].keys():
            name = get_user_from_jwt(event['headers']['authorization'])
        else:
            raise ValueError("Missing authorization header")
        
        # Query messages sent by the senderName
        sent_messages_response = table.query(
            IndexName='senderName-index',  # Assuming you have an index on senderName
            KeyConditionExpression='senderName = :sender',
            ExpressionAttributeValues={
                ':sender': name
            }
        )

        # Query messages sent to the receiverName
        received_messages_response = table.query(
            IndexName='receiverName-index',  # Assuming you have an index on receiverName
            KeyConditionExpression='receiverName = :receiver',
            ExpressionAttributeValues={
                ':receiver': name
            }
        )
        
        sent_messages = sent_messages_response.get('Items', [])
        received_messages = received_messages_response.get('Items', [])

        # Combine and return the results
        result = {
            'sent_messages': sent_messages,
            'received_messages': received_messages
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(str(e))
        }
