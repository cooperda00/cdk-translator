import { StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export interface IRestApiServiceProps extends StackProps {
  apiURL: string;
  sslCertificate: Certificate;
  zone: IHostedZone;
  userPool?: UserPool;
}

export class RestApiService extends Construct {
  public restApi: RestApi;
  public authorizer?: CognitoUserPoolsAuthorizer;
  public translationsResource: Resource;
  public translationResource: Resource;

  constructor(
    scope: Construct,
    id: string,
    { apiURL, sslCertificate, zone, userPool }: IRestApiServiceProps
  ) {
    super(scope, id);

    this.restApi = new RestApi(this, "translateAPI", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowCredentials: true,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      domainName: {
        certificate: sslCertificate,
        domainName: apiURL,
      },
    });

    this.translationsResource = this.restApi.root.addResource("translations");
    this.translationResource =
      this.translationsResource.addResource("{requestId}"); // Path Params

    if (userPool) {
      this.authorizer = new CognitoUserPoolsAuthorizer(this, "authorizer", {
        cognitoUserPools: [userPool],
        authorizerName: "userPoolAuthorizer",
      });
    }

    new ARecord(this, "apiDNS", {
      zone,
      recordName: "api",
      target: RecordTarget.fromAlias(new ApiGateway(this.restApi)),
    });
  }

  public mapLambdaToMethod({
    resource,
    method,
    lambda,
    isAuthed,
  }: {
    resource: Resource;
    method: "GET" | "POST" | "DELETE";
    lambda: NodejsFunction;
    isAuthed?: true;
  }) {
    let options: MethodOptions = {};

    if (isAuthed && this.authorizer) {
      options = {
        authorizer: this.authorizer,
        authorizationType: AuthorizationType.COGNITO,
      };
    }

    resource.addMethod(method, new LambdaIntegration(lambda), options);

    return this;
  }
}
