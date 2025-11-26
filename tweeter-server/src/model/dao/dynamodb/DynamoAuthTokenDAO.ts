import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DynamoDB } from "aws-sdk";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  private tableName = "tweeter-auth-tokens";
  private client = new DynamoDB.DocumentClient();

  async createAuthToken(token: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        token: token.token,
        userAlias: token.token.split('-')[0], // Extract user from token if needed
        timestamp: token.timestamp,
        ttl: Math.floor((token.timestamp + 24 * 60 * 60 * 1000) / 1000) // 24 hours TTL
      }
    };
    
    await this.client.put(params).promise();
  }

  async getAuthToken(token: string): Promise<AuthToken | null> {
    const params = {
      TableName: this.tableName,
      Key: { token }
    };
    
    const result = await this.client.get(params).promise();
    return result.Item ? new AuthToken(result.Item.token, result.Item.timestamp) : null;
  }

  async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { token }
    };
    
    await this.client.delete(params).promise();
  }

  async updateAuthTokenTimestamp(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { token },
      UpdateExpression: "SET #ts = :ts, #ttl = :ttl",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
        "#ttl": "ttl"
      },
      ExpressionAttributeValues: {
        ":ts": Date.now(),
        ":ttl": Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000)
      }
    };
    
    await this.client.update(params).promise();
  }
}