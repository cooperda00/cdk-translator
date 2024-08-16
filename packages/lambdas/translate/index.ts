import { APIGatewayProxyHandler } from "aws-lambda";
import { translateRequestSchema } from "@cdk-test/types";
import * as dynamoDb from "@aws-sdk/client-dynamodb";
import {
  gatewayResponse,
  translateText,
  MissingEnvironmentVariableException,
  TranslationTable,
} from "/opt/nodejs/lambda-layers-utils";

const { TRANSLATION_TABLE_NAME, TRANSLATION_TABLE_PARTITION_KEY } = process.env;

if (!TRANSLATION_TABLE_NAME) {
  throw new MissingEnvironmentVariableException("TRANSLATION_TABLE_NAME");
}

if (!TRANSLATION_TABLE_PARTITION_KEY) {
  throw new MissingEnvironmentVariableException(
    "TRANSLATION_TABLE_PARTITION_KEY"
  );
}

const db = new dynamoDb.DynamoDBClient({});

const translationTable = new TranslationTable(
  TRANSLATION_TABLE_NAME,
  TRANSLATION_TABLE_PARTITION_KEY,
  db
);

export const createTranslation: APIGatewayProxyHandler = async (e, context) => {
  try {
    if (!e.body) {
      return gatewayResponse(400, "No body provided");
    }

    const { success, data } = translateRequestSchema.safeParse(
      JSON.parse(e.body)
    );

    if (!success || !data) {
      return gatewayResponse(400, "Incorrect body provided");
    }

    const translation = await translateText(data);

    if (!translation) {
      return gatewayResponse(500, "Could not generate translation");
    }

    const timestamp = Date.now();

    await translationTable.createTranslationRecord({
      requestId: context.awsRequestId,
      ...data,
      timestamp,
      translation,
    });

    return gatewayResponse(
      200,
      JSON.stringify({
        timestamp,
        translation,
      })
    );
  } catch (e) {
    console.error(e);
    return gatewayResponse(500, "Could not process request");
  }
};

export const getTranslations: APIGatewayProxyHandler = async () => {
  try {
    const translations = await translationTable.getTranslations();

    return gatewayResponse(
      200,
      JSON.stringify({
        translations,
      })
    );
  } catch (e) {
    console.error(e);
    return gatewayResponse(500, "Could not process request");
  }
};
