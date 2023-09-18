import json
import boto3
import hashlib
import random
from datetime import datetime
import base64

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('message')
sns = boto3.client('sns')

def generate_message_id(sender_name, receiver_name, sent_date):
    # Generate ID from senderName, receiverName, sentDate, and a random number as a string
    data_to_hash = f"{sender_name}-{receiver_name}-{sent_date}-{random.randint(0, 1000)})"
    
    return hashlib.sha256(data_to_hash.encode()).hexdigest()

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
        senderName = get_user_from_jwt(event['headers']['authorization'])
        
        body = json.loads(event['body'])
        receiverName = body['receiverName']
        sentDate = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')
        
        message_id = generate_message_id(senderName, receiverName, sentDate)
        
        sns_topic_arn = 'arn:aws:sns:ap-southeast-2:149774945632:location_calculation.fifo'
        message_group_id = "location_message_group"
        request = {
            "message_id": message_id,
            "sent_date": sentDate,
            "send_location": {
                "latitude": 37.7749,
                "longitude": -122.4194
            },
            "receive_location": {
                "latitude": 40.73061,
                "longitude": -73.935242
            }
        }

        try:
            # Publish the message to the SNS topic
            sns.publish(
                TopicArn=sns_topic_arn,
                Message=json.dumps(request),
                MessageGroupId=message_group_id
            )
        except Exception as e:
            print(f"Error publishing message: {str(e)}")
            return {
                'statusCode': 500,
                'body': 'Error calculating path'
            }
        
        response = table.put_item(
            Item={
                'message_id': message_id,
                'senderName': senderName,
                'receiverName': receiverName,
                'sentDate': sentDate,
                'arrivalDate': None,
                'sentPigeon': body['sentPigeon'],
                'message': body['message']
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
            'body': json.dumps(str(e)),
            'cause': type(e).__name__
        }
