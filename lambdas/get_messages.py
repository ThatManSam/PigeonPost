import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('messages')

def lambda_handler(event, context):
    try:
        # Extract senderName and receiverName from the query parameters
        name = event['queryStringParameters']['user']

        # Query messages sent by the senderName
        sent_messages_response = table.query(
            IndexName='senderName-index',  # Assuming you have an index on senderName
            KeyConditionExpression='senderName = :sender',
            ExpressionAttributeValues={
                ':sender': name
            }
        )

        # # Query messages sent to the receiverName
        # received_messages_response = table.query(
        #     IndexName='ReceiverNameIndex',  # Assuming you have an index on receiverName
        #     KeyConditionExpression='receiverName = :receiver',
        #     ExpressionAttributeValues={
        #         ':receiver': name
        #     }
        # )
        received_messages_response = {
            'Items': []
        }

        sent_messages = sent_messages_response.get('Items', [])
        received_messages = received_messages_response.get('Items', [])

        # Combine and return the results
        result = {
            'sent_messages': sent_messages,
            'received_messages': received_messages
        }

        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
