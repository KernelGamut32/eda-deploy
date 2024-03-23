import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CreateDynamoDbTable extends Construct {
  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    new dynamodb.Table(this, id, {
      partitionKey: {
        name: 'MessageId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: tableName,
    });
  }
}
