import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AuthService,
  Certificates,
  RestApiService,
  StaticWebsiteDeployment,
  TranslationService,
} from "../constructs";
import { getAppConfig } from "../helpers";

const { apiSubdomain, domain, webSubdomain } = getAppConfig();

export class TranslationServiceStack extends cdk.Stack {
  private fullURL = `${webSubdomain}.${domain}`;
  private apiURL = `${apiSubdomain}.${domain}`;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { sslCertificate, zone, viewerCertificate } = new Certificates(
      this,
      "certificates",
      {
        apiURL: this.apiURL,
        domainName: domain,
        fullURL: this.fullURL,
      }
    );

    const { userPool } = new AuthService(this, "authService");

    const restApi = new RestApiService(this, "restApiService", {
      apiURL: this.apiURL,
      sslCertificate,
      zone,
      userPool,
    });

    new TranslationService(this, "translationService", {
      restApi,
    });

    new StaticWebsiteDeployment(this, "staticWebsiteDeployment", {
      domainName: domain,
      viewerCertificate,
      zone,
    });
  }
}
