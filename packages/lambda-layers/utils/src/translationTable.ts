import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { TranslationDBDocument } from "@cdk-test/types";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class TranslationTable {
  constructor(
    private tableName: string,
    private partitionKey: string,
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

  public async getTranslations() {
    const { Items } = await this.db.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    if (!Items) {
      return [];
    }

    return Items.map((item) => unmarshall(item)) as TranslationDBDocument[];
  }
}
