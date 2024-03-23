import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';

export class CreateSnsSqsSubscription extends Construct {
    constructor(scope: Construct, id: string, topicArn: string, filterPolicy: any, endpointArn: string) {
        super(scope, id);

        new sns.CfnSubscription(this, 'SNSSubscription', {
            topicArn: topicArn,
            filterPolicy: filterPolicy,
            filterPolicyScope: 'MessageBody',
            endpoint: endpointArn,
            protocol: 'sqs',
            rawMessageDelivery: false,
            region: 'us-east-1',
        });
    }
}
