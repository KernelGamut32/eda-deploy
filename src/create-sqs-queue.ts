import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CreateSqsQueue extends Construct {
    public queue: sqs.Queue;

    constructor(scope: Construct, id: string, queueName: string, topicArn: string) {
        super(scope, id);

        this.queue = new sqs.Queue(this, 'SQSQueue', {
            deliveryDelay: Duration.seconds(0),
            maxMessageSizeBytes: 262144,
            retentionPeriod: Duration.days(4),
            receiveMessageWaitTime: Duration.seconds(0),
            visibilityTimeout: Duration.seconds(30),
            queueName: queueName,
        });

        new sqs.QueuePolicy(this, 'SQSQueuePolicy', {
            queues: [this.queue],
        }).document.addStatements(
            new iam.PolicyStatement({
                sid: 'AllowSendMessage',
                effect: iam.Effect.ALLOW,
                principals: [new iam.ArnPrincipal(`arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:user/cloud_user`)],
                actions: ['sqs:SendMessage'],
                resources: [this.queue.queueArn],
            }),
            new iam.PolicyStatement({
                sid: 'AllowReceiveMessage',
                effect: iam.Effect.ALLOW,
                principals: [new iam.ArnPrincipal(`arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:user/cloud_user`)],
                actions: ['sqs:ChangeMessageVisibility', 'sqs:DeleteMessage', 'sqs:ReceiveMessage'],
                resources: [this.queue.queueArn],
            }),
            new iam.PolicyStatement({
                sid: 'AllowSnsSendMessage',
                effect: iam.Effect.ALLOW,
                principals: [new iam.AnyPrincipal()],
                actions: ['sqs:SendMessage'],
                resources: [this.queue.queueArn],
                conditions: {
                    ArnLike: {
                        'aws:SourceArn': topicArn,
                    },
                },
            }),
        );
    }
}
