#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TranslationServiceStack } from "./stacks/TranslationServiceStack";
import { getAppConfig } from "./helpers";

const { awsAccountId, awsRegion } = getAppConfig();

const app = new cdk.App();

new TranslationServiceStack(app, "TranslationService", {
  env: { account: awsAccountId, region: awsRegion },
});
