from datetime import datetime
import json
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Count items in the Lambda event 
    no_messages = str(len(event['Records']))
    print("Found " + no_messages + " messages to process.")

    for message in event['Records']:

        print(message)

        # Write message to DynamoDB
        table = dynamodb.Table('EUOrders')

        message_content = json.loads(message['body'])['Message']
        message_details = json.loads(message_content)
        response = table.put_item(
            Item={
                'MessageId': message['messageId'],
                'Body': message['body'],
                'Country': message_details['country'],
                'Timestamp': datetime.now().isoformat()
            }
        )
        print("Wrote message to DynamoDB:", json.dumps(response))
