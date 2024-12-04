#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DsqlNodePostgresStack } from '../lib/dsql-node-postgres-stack';

const app = new cdk.App();
new DsqlNodePostgresStack(app, 'DsqlNodePostgresStack', {
  env: {
    region: 'us-east-1'
  }
});