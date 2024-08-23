import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { TranslationDBDocument } from "@cdk-translator/types";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class TranslationTable {
  constructor(
    private tableName: string,
    private partitionKey: string,
    private sortKey: string,
    private db: DynamoDBClient
  ) {}

  public async createTranslationRecord(record: TranslationDBDocument) {
    return await this.db.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(record),
      })
    );
  }

  public async getTranslations({ username }: { username: string }) {
    const { Items } = await this.db.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "#PARTITION_KEY = :username",
        ExpressionAttributeNames: {
          "#PARTITION_KEY": "username",
        },
        ExpressionAttributeValues: {
          ":username": { S: username },
        },
        ScanIndexForward: true,
      })
    );

    if (!Items) {
      return [];
    }

    return (
      Items.map((item) => unmarshall(item)) as TranslationDBDocument[]
    ).sort((a, b) => b.timestamp - a.timestamp); // Desc
  }

  public async deleteTranslation({
    username,
    requestId,
  }: {
    username: string;
    requestId: string;
  }) {
    await this.db.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          [this.partitionKey]: { S: username },
          [this.sortKey]: { S: requestId },
        },
      })
    );

    return requestId;
  }
}
