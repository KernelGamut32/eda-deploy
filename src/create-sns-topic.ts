import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';

export class CreateSnsTopic extends Construct {
    public topic: sns.Topic;

    constructor(scope: Construct, id: string, topicName: string) {
        super(scope, id);

        this.topic = new sns.Topic(this, 'SNSTopic', {
            topicName: topicName,
        });
    }
}
