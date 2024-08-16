import { CfnOutput, RemovalPolicy, StackProps } from "aws-cdk-lib";
import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthService extends Construct {
  public userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, "translationServiceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.userPoolClient = new UserPoolClient(
      this,
      "translationServiceUserPoolClient",
      {
        userPool,
        userPoolClientName: "translationServiceWebClient",
        generateSecret: false,
        supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      }
    );

    new CfnOutput(this, "userPool", { value: userPool.userPoolId });

    new CfnOutput(this, "userPoolClient", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
