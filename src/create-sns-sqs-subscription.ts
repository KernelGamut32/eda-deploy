import { Construct } from "constructs";
import * as sns from 'aws-cdk-lib/aws-sns';

export class CreateSnsSqsSubscription extends Construct {
    public topic: sns.CfnSubscription;

    constructor(scope: Construct, id: string, topicArn: string, filterPolicy: string, endpoint: string) {
        super(scope, id);

        this.topic = new sns.CfnSubscription(this, 'SNSSubscription', {
            topicArn: topicArn,
            filterPolicy: filterPolicy,
            endpoint: endpoint,
            protocol: "sqs",
            rawMessageDelivery: false,
            region: "us-east-1"
        });
    }
}
