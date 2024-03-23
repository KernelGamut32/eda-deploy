import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';

export class CreateSqsQueue extends Construct {
    public queue: sqs.Queue;

    constructor(scope: Construct, id: string, queueName: string) {
        super(scope, id);

        this.queue = new sqs.Queue(this, 'SQSQueue', {
            deliveryDelay: Duration.seconds(0),
            maxMessageSizeBytes: 262144,
            retentionPeriod: Duration.days(4),
            receiveMessageWaitTime: Duration.seconds(0),
            visibilityTimeout: Duration.seconds(30),
            queueName: queueName,
        });
    }
}
