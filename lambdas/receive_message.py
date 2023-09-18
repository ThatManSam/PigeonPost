import json
import boto3
import hashlib
import random
from datetime import datetime
import base64

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
message_table = dynamodb.Table('message')
users_table = dynamodb.Table('users')
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
        if 'authorization' in event['headers'].keys():
            senderName = get_user_from_jwt(event['headers']['authorization'])
        else:
            raise ValueError("Missing authorization header")
        
        body = json.loads(event['body'])
        
        if 'message' in body.keys():
            message = body['message']
        else:
            raise ValueError("Missing key 'message' in body")
        
        if 'receiverName' in body.keys():
            receiverName = body['receiverName']
        else:
            raise ValueError("Missing key 'receiverName' in body")
        
        # Get location of receiver and check they exist
        receiver_user_response = users_table.query(
            KeyConditionExpression='user_id = :user',
            ExpressionAttributeValues={
                ':user': senderName
            }
        )
        receiver_user = receiver_user_response.get('Items', [])
        if len(receiver_user) == 0:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps(f"Recipient does not exist")
            }
        receive_location = json.loads(receiver_user[0]['location'])
        
        # Query messages sent by the senderName
        sender_user_response = users_table.query(
            KeyConditionExpression='user_id = :user',
            ExpressionAttributeValues={
                ':user': senderName
            }
        )
        sender_user = sender_user_response.get('Items', [])
        send_location = json.loads(sender_user[0]['location'])
        
        sentDate = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')
        
        message_id = generate_message_id(senderName, receiverName, sentDate)
        
        sns_topic_arn = 'arn:aws:sns:ap-southeast-2:149774945632:location_calculation.fifo'
        message_group_id = "location_message_group"
        request = {
            "message_id": message_id,
            "sent_date": sentDate,
            "send_location": send_location,
            "receive_location": receive_location
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
        
        response = message_table.put_item(
            Item={
                'message_id': message_id,
                'senderName': senderName,
                'receiverName': receiverName,
                'sentDate': sentDate,
                'arrivalDate': None,
                'message': message
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
