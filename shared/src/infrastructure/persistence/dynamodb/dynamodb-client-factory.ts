import { Nullable } from '../../../domain/nullable';
import { DynamoDBConfig } from './dynamodb-config';
import { DynamoDB } from 'aws-sdk';

export class DynamoDBClientFactory {
  private static clients: { [key: string]: DynamoDB.DocumentClient } = {};

  static createClient(config: DynamoDBConfig, tableName: string): DynamoDB.DocumentClient {
    let client = DynamoDBClientFactory.getClient(tableName);

    if (!client) {
      client = DynamoDBClientFactory.createAndConnectClient(config);
      DynamoDBClientFactory.registerClient(client, tableName);
    }

    return client;
  }

  private static getClient(tableName: string): Nullable<DynamoDB.DocumentClient> {
    return DynamoDBClientFactory.clients[tableName] || null;
  }

  private static createAndConnectClient(config: DynamoDBConfig): DynamoDB.DocumentClient {
    const client = new DynamoDB.DocumentClient({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.endpoint
    });

    return client;
  }

  private static registerClient(client: DynamoDB.DocumentClient, tableName: string): void {
    DynamoDBClientFactory.clients[tableName] = client;
  }
}
