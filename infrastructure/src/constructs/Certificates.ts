import { StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { ViewerCertificate } from "aws-cdk-lib/aws-cloudfront";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";

import { Construct } from "constructs";

export interface ICertificatesProps extends StackProps {
  domainName: string;
  fullURL: string;
  apiURL: string;
}

export class Certificates extends Construct {
  zone: IHostedZone;
  sslCertificate: Certificate;
  viewerCertificate: ViewerCertificate;

  constructor(
    scope: Construct,
    id: string,
    { domainName, fullURL, apiURL }: ICertificatesProps
  ) {
    super(scope, id);

    this.zone = HostedZone.fromLookup(this, "zone", { domainName });

    this.sslCertificate = new Certificate(this, "certificate", {
      domainName,
      subjectAlternativeNames: [fullURL, apiURL],
      validation: CertificateValidation.fromDns(this.zone),
    });

    this.viewerCertificate = ViewerCertificate.fromAcmCertificate(
      this.sslCertificate,
      {
        aliases: [domainName, fullURL, apiURL],
      }
    );
  }
}
