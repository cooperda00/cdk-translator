import { StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export interface IRestApiServiceProps extends StackProps {
  apiURL: string;
  sslCertificate: Certificate;
  zone: IHostedZone;
}

export class RestApiService extends Construct {
  public restApi: RestApi;

  constructor(
    scope: Construct,
    id: string,
    { apiURL, sslCertificate, zone }: IRestApiServiceProps
  ) {
    super(scope, id);

    this.restApi = new RestApi(this, "translateAPI", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      domainName: {
        certificate: sslCertificate,
        domainName: apiURL,
      },
    });

    new ARecord(this, "apiDNS", {
      zone,
      recordName: "api",
      target: RecordTarget.fromAlias(new ApiGateway(this.restApi)),
    });
  }

  public mapLambdaToMethod({
    method,
    lambda,
  }: {
    method: "GET" | "POST";
    lambda: NodejsFunction;
  }) {
    this.restApi.root.addMethod(method, new LambdaIntegration(lambda));
    return this;
  }
}
