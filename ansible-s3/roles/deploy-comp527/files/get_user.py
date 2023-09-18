import json
import boto3
import base64

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')


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
        
        # Query messages sent by the user
        sent_messages_response = table.query(
            KeyConditionExpression='user_id = :user',
            ExpressionAttributeValues={
                ':user': name
            }
        )

        sent_messages = sent_messages_response.get('Items', [])
        if len(sent_messages) > 0:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps("User exists")
            }
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps("User does not exist")
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(str(e))
        }
