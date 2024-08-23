import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  CloudFrontWebDistribution,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { clientDistPath } from "../helpers";

export interface IStaticWebsiteDeploymentProps extends StackProps {
  domainName: string;
  viewerCertificate: ViewerCertificate;
  zone: IHostedZone;
}

export class StaticWebsiteDeployment extends Construct {
  public restApi: RestApi;

  constructor(
    scope: Construct,
    id: string,
    { domainName, viewerCertificate, zone }: IStaticWebsiteDeploymentProps
  ) {
    super(scope, id);

    const bucket = new Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new CloudFrontWebDistribution(
      this,
      "WebsiteCloundFrontDist",
      {
        viewerCertificate,
        originConfigs: [
          {
            s3OriginSource: { s3BucketSource: bucket },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new BucketDeployment(this, "WebsiteDeployment", {
      destinationBucket: bucket,
      sources: [Source.asset(clientDistPath)],
      distribution,
      distributionPaths: ["/*"], // Invalidate cache when any file changes
      memoryLimit: 512,
    });

    new ARecord(this, "route53Domain", {
      zone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    new ARecord(this, "route53FullURL", {
      zone,
      recordName: "www",
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
