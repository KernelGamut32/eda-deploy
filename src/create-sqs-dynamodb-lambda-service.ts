import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

export class CreateSqsDynamoDBLambdaService extends Construct {
  constructor(scope: Construct, id: string, role: Role, functionName: string, sqsQueue: IQueue) {
    super(scope, id);

    const newLambda = new lambda.Function(this, id, {
      functionName: functionName,
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset(`resources/${functionName}`),
      handler: 'lambda_function.lambda_handler',
      timeout: cdk.Duration.seconds(10),
      role: role,
    });

    newLambda.addEventSource(
      new SqsEventSource(sqsQueue, {
        batchSize: 10,
        enabled: true,
        maxBatchingWindow: cdk.Duration.seconds(0),
      })
    );
  }
}
