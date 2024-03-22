import { Construct } from "constructs";
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CreateSqsQueue extends Construct {
    public queue: sqs.CfnQueue;

    constructor(scope: Construct, id: string, queueName: string) {
        super(scope, id);

        this.queue = new sqs.CfnQueue(this, 'SQSQueue', {
            delaySeconds: 0,
            maximumMessageSize: 262144,
            messageRetentionPeriod: 345600,
            receiveMessageWaitTimeSeconds: 0,
            visibilityTimeout: 30,
            queueName: queueName
        });
    }
}
