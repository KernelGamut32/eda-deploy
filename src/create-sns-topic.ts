import { Construct } from "constructs";
import * as sns from 'aws-cdk-lib/aws-sns';

export class CreateSnsTopic extends Construct {
    public topic: sns.CfnTopic;

    constructor(scope: Construct, id: string, topicName: string) {
        super(scope, id);

        this.topic = new sns.CfnTopic(this, 'SNSTopic', {
            topicName: topicName
        });
    }
}
