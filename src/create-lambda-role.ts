import { Construct } from "constructs";
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class CreateLambdaRole extends Construct {
    public role: Role;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.role = new Role(this, id, {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        });
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

        new ManagedPolicy(this, "OrderProcessorPolicy", {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        "logs:CreateLogStream",
                        "logs:PutLogEvents",
                        "dynamodb:DeleteItem",
                        "dynamodb:GetItem",
                        "dynamodb:PutItem",
                        "dynamodb:Scan",
                        "dynamodb:UpdateItem",
                        "sqs:DeleteMessage",
                        "sqs:GetQueueAttributes",
                        "sqs:ReceiveMessage"
                    ],
                    resources: ["*"]
                })
            ],
            roles: [this.role]
        });
    }
}
