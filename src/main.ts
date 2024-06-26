import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as create_lambda_role from './create-lambda-role';
import * as create_sns_topic from './create-sns-topic';
import * as create_sqs_queue from './create-sqs-queue';
import * as create_sns_sqs_subscription from './create-sns-sqs-subscription';
import * as create_dynamodb_table from './create-dynamodb-table';
import * as create_sqs_dynamodb_lambda_service from './create-sqs-dynamodb-lambda-service';
import * as sns from 'aws-cdk-lib/aws-sns';

export class EdaDeployStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const lambdaRole = new create_lambda_role.CreateLambdaRole(this, 'OrderProcessorRole');

    const ordersTopic = new create_sns_topic.CreateSnsTopic(this, 'OrdersTopic', 'Orders');

    const euOrdersQueue = new create_sqs_queue.CreateSqsQueue(this, 'EUOrdersQueue', 'EUOrders', ordersTopic.topic.topicArn);
    const largeEUOrdersQueue = new create_sqs_queue.CreateSqsQueue(this, 'LargeEUOrdersQueue', 'LargeEUOrders', ordersTopic.topic.topicArn);
    const largeOtherOrdersQueue = new create_sqs_queue.CreateSqsQueue(this, 'LargeOtherOrdersQueue', 'LargeOtherOrders', ordersTopic.topic.topicArn);

    new create_sns_sqs_subscription.CreateSnsSqsSubscription(this,
      'EUOrdersSubscription',
      ordersTopic.topic.topicArn,
      {
        location: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            matchPrefixes: ['eu'],
          }),
        ),
        quantity: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.numericFilter({
            betweenStrict: { start: 0, stop: 100 },
          }),
        )
      },
      euOrdersQueue.queue.queueArn);
    new create_sns_sqs_subscription.CreateSnsSqsSubscription(this,
      'LargeEUOrdersSubscription',
      ordersTopic.topic.topicArn,
      {
        location: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            matchPrefixes: ['eu'],
          }),
        ),
        quantity: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.numericFilter({
            greaterThanOrEqualTo: 100,
          }),
        )
      },
      largeEUOrdersQueue.queue.queueArn);
    new create_sns_sqs_subscription.CreateSnsSqsSubscription(this,
      'LargeOtherOrdersSubscription',
      ordersTopic.topic.topicArn,
      {
        quantity: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.numericFilter({
            greaterThanOrEqualTo: 100,
          })
        )
      },
      largeOtherOrdersQueue.queue.queueArn);

    new create_dynamodb_table.CreateDynamoDbTable(this, 'EUOrdersTable', 'EUOrders');
    new create_dynamodb_table.CreateDynamoDbTable(this, 'LargeEUOrdersTable', 'LargeEUOrders');
    new create_dynamodb_table.CreateDynamoDbTable(this, 'LargeOtherOrdersTable', 'LargeOtherOrders');

    new create_sqs_dynamodb_lambda_service.CreateSqsDynamoDBLambdaService(this, 'EUOrderProcessor',
      lambdaRole.role, 'EUOrderProcessor', euOrdersQueue.queue);
    new create_sqs_dynamodb_lambda_service.CreateSqsDynamoDBLambdaService(this, 'LargeEUOrderProcessor',
      lambdaRole.role, 'LargeEUOrderProcessor', largeEUOrdersQueue.queue);
    new create_sqs_dynamodb_lambda_service.CreateSqsDynamoDBLambdaService(this, 'LargeOtherOrderProcessor',
      lambdaRole.role, 'LargeOtherOrderProcessor', largeOtherOrdersQueue.queue);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new EdaDeployStack(app, 'eda-deploy-dev', { env: devEnv });
// new EdaDeployStack(app, 'eda-deploy-prod', { env: prodEnv });

app.synth();