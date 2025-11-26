import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDB } from "aws-sdk";
import * as bcrypt from "bcryptjs";

export class DynamoUserDAO implements UserDAO {
  private tableName = "tweeter-users";
  private client = new DynamoDB.DocumentClient();

  async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { alias }
    };
    
    const result = await this.client.get(params).promise();
    return result.Item ? new User(result.Item.firstName, result.Item.lastName, result.Item.alias, result.Item.imageUrl) : null;
  }

  async createUser(user: User, hashedPassword: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        hashedPassword,
        followerCount: 0,
        followeeCount: 0
      }
    };
    
    await this.client.put(params).promise();
  }

  async getUserByCredentials(alias: string, password: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { alias }
    };
    
    const result = await this.client.get(params).promise();
    if (!result.Item) return null;
    
    const isValid = await bcrypt.compare(password, result.Item.hashedPassword);
    return isValid ? new User(result.Item.firstName, result.Item.lastName, result.Item.alias, result.Item.imageUrl) : null;
  }

  async updateUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { alias: user.alias },
      UpdateExpression: "SET firstName = :fn, lastName = :ln, imageUrl = :img",
      ExpressionAttributeValues: {
        ":fn": user.firstName,
        ":ln": user.lastName,
        ":img": user.imageUrl
      }
    };
    
    await this.client.update(params).promise();
  }

  async deleteUser(alias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { alias }
    };
    
    await this.client.delete(params).promise();
  }
}