import * as lambda from "aws-lambda";

export const gatewayResponse = (
  statusCode: number,
  body: string
): lambda.APIGatewayProxyResult => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  };

  return {
    statusCode,
    headers,
    body,
  };
};
