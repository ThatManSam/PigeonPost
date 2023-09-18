import json
import boto3
import base64

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')
sns = boto3.client('sns')

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
        
        body = json.loads(event['body'])
        if 'location' in body.keys():
            location = body['location']
        else:
            raise ValueError("Missing location in body")
        
        response = table.put_item(
            Item={
                'user_id': name,
                'location': json.dumps(location)
            }
        )
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps('SUCCESS')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(str(e)),
            'cause': type(e).__name__
        }
