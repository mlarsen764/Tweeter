import { DynamoDB } from "aws-sdk";

export abstract class BaseDynamoDAO {
  protected client = new DynamoDB.DocumentClient();

  protected async get<T>(tableName: string, key: any): Promise<T | null> {
    const params = { TableName: tableName, Key: key };
    const result = await this.client.get(params).promise();
    return result.Item as T || null;
  }

  protected async put(tableName: string, item: any): Promise<void> {
    const params = { TableName: tableName, Item: item };
    await this.client.put(params).promise();
  }

  protected async delete(tableName: string, key: any): Promise<void> {
    const params = { TableName: tableName, Key: key };
    await this.client.delete(params).promise();
  }

  protected async update(tableName: string, key: any, updateExpression: string, expressionAttributeValues: any, expressionAttributeNames?: any): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };
    if (expressionAttributeNames) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }
    await this.client.update(params).promise();
  }

  protected async query(params: DynamoDB.DocumentClient.QueryInput): Promise<DynamoDB.DocumentClient.QueryOutput> {
    return await this.client.query(params).promise();
  }
}