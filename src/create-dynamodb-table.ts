import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CreateDynamoDbTable extends Construct {
  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    new dynamodb.CfnTable(this, id, {
      attributeDefinitions: [
        {
          attributeName: 'MessageId',
          attributeType: 'S'
        }
      ],
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: tableName,
      keySchema: [
        {
          attributeName: 'MessageId',
          keyType: 'HASH'
        }
      ]
    });
  }
}
