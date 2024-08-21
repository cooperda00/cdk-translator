import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { translateRequestSchema } from "@cdk-test/types";
import * as dynamoDb from "@aws-sdk/client-dynamodb";
import {
  gatewayResponse,
  translateText,
  MissingEnvironmentVariableException,
  TranslationTable,
} from "/opt/nodejs/lambda-layers-utils";

// TODO : type responses

const {
  TRANSLATION_TABLE_NAME,
  TRANSLATION_TABLE_PARTITION_KEY,
  TRANSLATION_TABLE_SORT_KEY,
} = process.env;

if (!TRANSLATION_TABLE_NAME) {
  throw new MissingEnvironmentVariableException("TRANSLATION_TABLE_NAME");
}

if (!TRANSLATION_TABLE_PARTITION_KEY) {
  throw new MissingEnvironmentVariableException(
    "TRANSLATION_TABLE_PARTITION_KEY"
  );
}

if (!TRANSLATION_TABLE_SORT_KEY) {
  throw new MissingEnvironmentVariableException("TRANSLATION_TABLE_SORT_KEY");
}

const db = new dynamoDb.DynamoDBClient({});

const translationTable = new TranslationTable(
  TRANSLATION_TABLE_NAME,
  TRANSLATION_TABLE_PARTITION_KEY,
  TRANSLATION_TABLE_SORT_KEY,
  db
);

export const createTranslation: APIGatewayProxyHandler = async (e, context) => {
  const usernameResult = getUsernameFromRequest(e);

  if (usernameResult.error === "NO_CLAIMS") {
    return gatewayResponse(401, "User not authenticated");
  }

  if (usernameResult.error === "NO_USER") {
    return gatewayResponse(401, "User does not exist");
  }

  try {
    // TODO : refactor body parsing
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
      ...data,
      requestId: context.awsRequestId,
      timestamp,
      translation,
      username: usernameResult.username!,
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

export const getTranslations: APIGatewayProxyHandler = async (e) => {
  const usernameResult = getUsernameFromRequest(e);

  if (usernameResult.error === "NO_CLAIMS") {
    return gatewayResponse(401, "User not authenticated");
  }

  if (usernameResult.error === "NO_USER") {
    return gatewayResponse(401, "User does not exist");
  }

  try {
    const translations = await translationTable.getTranslations({
      username: usernameResult.username!,
    });

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

export const deleteTranslation: APIGatewayProxyHandler = async (e) => {
  const usernameResult = getUsernameFromRequest(e);

  if (usernameResult.error === "NO_CLAIMS") {
    return gatewayResponse(401, "User not authenticated");
  }

  if (usernameResult.error === "NO_USER") {
    return gatewayResponse(401, "User does not exist");
  }

  const requestId = e.pathParameters?.requestId;

  if (!requestId) {
    return gatewayResponse(404, "Invalid path parameters");
  }

  const deletedRequestId = await translationTable.deleteTranslation({
    username: usernameResult.username!,
    requestId,
  });

  try {
    return gatewayResponse(200, JSON.stringify({ deletedRequestId }));
  } catch (e) {
    console.error(e);
    return gatewayResponse(500, "Could not process request");
  }
};

const getUsernameFromRequest = (
  e: APIGatewayProxyEvent
):
  | { username: string; error?: never }
  | { username?: never; error: "NO_CLAIMS" | "NO_USER" } => {
  const claims = e.requestContext.authorizer?.claims;

  if (!claims) {
    return { error: "NO_CLAIMS" };
  }

  const username = claims["cognito:username"];

  if (!username || typeof username !== "string") {
    return { error: "NO_USER" };
  }

  return { username };
};
