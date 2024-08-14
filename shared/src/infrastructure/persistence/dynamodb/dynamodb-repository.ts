import { AggregateRoot } from '../../../domain/aggregate-root';
import { Criteria } from '../../../domain/criteria/criteria';
import { DynamoDBCriteriaConverter } from './dynamodb-criteria-converter';
import { Filters, Nullable } from '../../../domain';
import { DynamoDB } from 'aws-sdk';
import { DynamoDBUpdateConverter } from './dynamodb-update-converter';

export abstract class DynamoDBRepository<T extends AggregateRoot> {
  private criteriaConverter: DynamoDBCriteriaConverter;
  private updateConverter: DynamoDBUpdateConverter;
  protected client: DynamoDB.DocumentClient = this._client;
  protected tableName: string = '';

  constructor(private _client: DynamoDB.DocumentClient) {
    this.criteriaConverter = new DynamoDBCriteriaConverter();
    this.updateConverter = new DynamoDBUpdateConverter();
  }

  protected async scanByCriteria<D>(criteria: Criteria): Promise<D[]> {
    const query = this.criteriaConverter.convert(criteria);
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: query.filter,
      ExpressionAttributeValues: query.values,
      ExpressionAttributeNames: query.attributeNames
    };

    try {
      const result = await this.client.scan(params).promise();
      return result.Items as D[];
    } catch (error) {
      throw new Error(`Error querying items to ${this.tableName}`);
    }
  }

  protected async scan<D>(): Promise<D[]> {
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName
    };

    try {
      const result = await this.client.scan(params).promise();
      return result.Items as D[];
    } catch (error) {
      throw new Error(`Error querying items to ${this.tableName}`);
    }
  }

  protected async getItemById<D>(id: string): Promise<Nullable<D>> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: { id }
    };
    try {
      const result = await this._client.get(params).promise();
      return result.Item as D;
    } catch (error) {
      throw new Error(`Error getting item from ${this.tableName}`);
    }
  }

  protected async scanByFilters<D>(filters: Filters): Promise<Nullable<D>> {
    const query = this.criteriaConverter.getFilters(filters);
    const attributeNames = this.criteriaConverter.getExpressionAttributeNames(filters);
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
      FilterExpression: query.filter,
      ExpressionAttributeValues: query.values,
      ExpressionAttributeNames: attributeNames
    };

    try {
      const result = await this._client.scan(params).promise();
      if (!result.Items) {
        return null;
      }
      return result.Items[0] as D;
    } catch (error) {
      throw new Error(`Error querying items to ${this.tableName}`);
    }
  }

  protected async delete(id: string): Promise<void> {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: { id }
    };
    try {
      await this._client.delete(params).promise();
    } catch (error) {
      throw new Error(`Error deleting item to ${this.tableName}`);
    }
  }

  protected async persist(aggregateRoot: T): Promise<void> {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: { ...aggregateRoot.toPrimitives() }
    };
    try {
      await this._client.put(params).promise();
    } catch (error) {
      throw new Error(`Error saving item to ${this.tableName}`);
    }
  }

  protected async updateItemById(key: { [key: string]: any }, updateData: T): Promise<void> {
    const { attributeNames, updateExpression, values } = this.updateConverter.convert(
      { ...updateData.toPrimitives() },
      Object.keys(key)[0]
    );
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: values,
      ExpressionAttributeNames: attributeNames
    };

    try {
      await this._client.update(params).promise();
    } catch (error) {
      throw new Error(`Error querying items to ${this.tableName}`);
    }
  }
}
