import pandas as pd
import heapq
import math
import boto3

from io import StringIO

import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('locations')
s3 = boto3.resource('s3')
locations_table_name = 'locations'
message_table_name = 'message'

# TODO: ADD MALS CODE IN HERE

def lambda_handler(event, context):
    sqs_message = json.loads(event['Records'][0]['body'])
    message_id = sqs_message['message_id']
    send_location = sqs_message['send_location']
    receive_location = sqs_message['receive_location']
    sent_date = sqs_message['sent_date']
    
    try:
        # Specify the S3 bucket name and the object (file) key
        bucket_name = 'pigeon-post-data-sets'
        object_key = 'dataset/filtered_cities.csv'
        
        try:
            # Read the file from S3
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            content = response['Body'].read().decode('utf-8')
        except Exception as e:
            print(f"Error reading file from S3: {str(e)}")
            return {
                'statusCode': 500,
                'body': 'Error reading file from S3'
            }
        
        # TODO: READ THIS INTO THE CSV
        df = pd.read_csv(StringIO(content))
        
        #Run a*
        path = a_star_search("Auckland", "Chicago", df, distance_threshold=2000)
        
        # Put a new item in the "locations" table
        locations_table = dynamodb.Table(locations_table_name)
        locations_table.put_item(Item={'message_id': message_id, 'locations': path})

        # Update the "arrivalDate" field in the "message" table
        message_table = dynamodb.Table(message_table_name)
        response = message_table.update_item(
            Key={'message_id': message_id},
            UpdateExpression='SET arrivalDate = :arrival_date',
            ExpressionAttributeValues={':arrival_date': sent_date}
        )
        
        return {
            'statusCode': 200,
            'body': 'Locations caluclated'
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': str(e)
        }
