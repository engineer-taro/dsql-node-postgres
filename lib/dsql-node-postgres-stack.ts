import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class DsqlNodePostgresStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Lambda -> DSQLのIAMロールを作成
    const role = new iam.Role(this, 'DsqlSampleRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAuroraDSQLFullAccess'));
    
    // Lambdaを定義
    new NodejsFunction(this, 'DsqlSampleFunction', {
      entry: 'lambda/handler.ts',
      environment: {
        CLUSTER_ENDPOINT: "<YOUR_ENDPOINT>"
      }
    });
  }
}
