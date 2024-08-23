import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Code,
  ILayerVersion,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import { RestApiService } from "./RestApiService";
import { lambdaLayersPath, lambdasPackagesPath } from "../helpers";

export interface ITranslationServiceProps extends StackProps {
  restApi: RestApiService;
}

export class TranslationService extends Construct {
  private tableName = "translationsTable";
  private partitionKey = "username";
  private sortKey = "requestId";

  public layers: ILayerVersion[];
  public restApi: RestApiService;

  constructor(
    scope: Construct,
    id: string,
    { restApi }: ITranslationServiceProps
  ) {
    super(scope, id);

    this.restApi = restApi;

    new Table(this, "translationsTable", {
      tableName: this.tableName,
      partitionKey: {
        name: this.partitionKey,
        type: AttributeType.STRING,
      },
      sortKey: {
        name: this.sortKey,
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const translateAccessPolicy = new PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    const translationTableAccessPolicy = new PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
      ],
      resources: ["*"],
    });

    this.layers = [
      new LayerVersion(this, "utils", {
        code: Code.fromAsset(lambdaLayersPath),
        compatibleRuntimes: [Runtime.NODEJS_20_X],
        removalPolicy: RemovalPolicy.DESTROY,
      }),
    ];

    const createTranslationFunc = this.createNodejsLambda({
      id: "translate",
      handler: "createTranslation",
      policies: [translateAccessPolicy, translationTableAccessPolicy],
    });

    restApi.mapLambdaToMethod({
      resource: restApi.translationsResource, // at path /translation
      method: "POST",
      lambda: createTranslationFunc,
      isAuthed: true,
    });

    const getTranslationsFunc = this.createNodejsLambda({
      id: "getTranslations",
      handler: "getTranslations",
      policies: [translationTableAccessPolicy],
    });

    restApi.mapLambdaToMethod({
      resource: restApi.translationsResource,
      method: "GET",
      lambda: getTranslationsFunc,
      isAuthed: true,
    });

    const deleteTranslationsFunc = this.createNodejsLambda({
      id: "deleteTranslation",
      handler: "deleteTranslation",
      policies: [translationTableAccessPolicy],
    });

    restApi.mapLambdaToMethod({
      resource: restApi.translationResource,
      method: "DELETE",
      lambda: deleteTranslationsFunc,
      isAuthed: true,
    });
  }

  private createNodejsLambda({
    id,
    handler,
    policies,
  }: {
    id: string;
    handler: string;
    policies: PolicyStatement[];
  }) {
    return new NodejsFunction(this, id, {
      entry: path.join(lambdasPackagesPath, "translate/index.ts"),
      handler,
      runtime: Runtime.NODEJS_20_X,
      initialPolicy: policies,
      environment: {
        TRANSLATION_TABLE_NAME: this.tableName,
        TRANSLATION_TABLE_PARTITION_KEY: this.partitionKey,
        TRANSLATION_TABLE_SORT_KEY: this.sortKey,
      },
      layers: this.layers,
      bundling: {
        minify: true,
      },
    });
  }
}
