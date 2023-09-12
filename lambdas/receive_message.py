import json
import boto3
import hashlib
import random
from datetime import datetime

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('messages')

def generate_message_id(sender_name, receiver_name, sent_date):
    # Generate ID from senderName, receiverName, sentDate, and a random number as a string
    data_to_hash = f"{sender_name}-{receiver_name}-{sent_date}-{random.randint(0, 1000)})"
    
    return hashlib.sha256(data_to_hash.encode()).hexdigest()

def lambda_handler(event, context):
    try:
        body = event['body']
        senderName = body['senderName']
        receiverName = body['receiverName']
        sentDate = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')
        
        message_id = generate_message_id(senderName, receiverName, sentDate)
        
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
            'statusCode': 200,
            'body': json.dumps('SUCCESS')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e)),
            'cause': type(e).__name__
        }
