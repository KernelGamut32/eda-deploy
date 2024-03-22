import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Role } from 'aws-cdk-lib/aws-iam';
import * as lambda from "aws-cdk-lib/aws-lambda";

export class CreateSqsDynamoDBLambdaService extends Construct {
  public lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, role: Role, functionName: string, sqsQueueRef: string) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, id, {
      functionName: functionName,
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset(`resources/${functionName}`),
      handler: "lambda_function.lambda_handler",
      timeout: cdk.Duration.seconds(10),
      role: role,
    });

    new lambda.CfnEventSourceMapping(this, 'LambdaEventSourceMapping', {
      batchSize: 10,
      eventSourceArn: sqsQueueRef,
      functionName: functionName,
      enabled: true,
      maximumBatchingWindowInSeconds: 0
    }
    );
  }
}
