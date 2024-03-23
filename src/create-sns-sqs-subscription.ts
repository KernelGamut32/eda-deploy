import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';

export class CreateSnsSqsSubscription extends Construct {
    constructor(scope: Construct, id: string, topicArn: string, 
        filter: { [attribute: string]: sns.Filter }, endpointArn: string) {
        super(scope, id);

        new sns.Subscription(this, 'SNSSubscription', {
            topic: sns.Topic.fromTopicArn(this, 'SNSTopic', topicArn),
            filterPolicyWithMessageBody: filter,
            endpoint: endpointArn,
            protocol: sns.SubscriptionProtocol.SQS,
            rawMessageDelivery: false,
            region: 'us-east-1',
        });
    }
}
