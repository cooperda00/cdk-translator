import { CfnOutput, RemovalPolicy, StackProps } from "aws-cdk-lib";
import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthService extends Construct {
  public userPool: UserPool;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, "translationServiceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userPoolClient = new UserPoolClient(
      this,
      "translationServiceUserPoolClient",
      {
        userPool: this.userPool,
        userPoolClientName: "translationServiceWebClient",
        generateSecret: false,
        supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      }
    );

    new CfnOutput(this, "userPool", { value: this.userPool.userPoolId });

    new CfnOutput(this, "userPoolClient", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
