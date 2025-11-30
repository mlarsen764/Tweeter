import { User } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";
import { DynamoDB } from "aws-sdk";

export class DynamoFollowDAO implements FollowDAO {
  private tableName = "tweeter-follows";
  private indexName = "followeeAlias-followerAlias-index";
  private client = new DynamoDB.DocumentClient();

  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        followerAlias: followerAlias,
        followeeAlias: followeeAlias
      }
    };
    await this.client.put(params).promise();
    
    // Update follower count for followee
    await this.client.update({
      TableName: "tweeter-users",
      Key: { alias: followeeAlias },
      UpdateExpression: "ADD followerCount :inc",
      ExpressionAttributeValues: { ":inc": 1 }
    }).promise();
    
    // Update followee count for follower
    await this.client.update({
      TableName: "tweeter-users",
      Key: { alias: followerAlias },
      UpdateExpression: "ADD followeeCount :inc",
      ExpressionAttributeValues: { ":inc": 1 }
    }).promise();
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        followerAlias: followerAlias,
        followeeAlias: followeeAlias
      }
    };
    await this.client.delete(params).promise();
    
    // Update follower count for followee
    await this.client.update({
      TableName: "tweeter-users",
      Key: { alias: followeeAlias },
      UpdateExpression: "ADD followerCount :dec",
      ExpressionAttributeValues: { ":dec": -1 }
    }).promise();
    
    // Update followee count for follower
    await this.client.update({
      TableName: "tweeter-users",
      Key: { alias: followerAlias },
      UpdateExpression: "ADD followeeCount :dec",
      ExpressionAttributeValues: { ":dec": -1 }
    }).promise();
  }

  async getFollowees(followerAlias: string, limit: number, lastFolloweeAlias?: string): Promise<[User[], boolean]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: "followerAlias = :follower",
      ExpressionAttributeValues: { ":follower": followerAlias },
      Limit: limit,
      ScanIndexForward: true
    };

    if (lastFolloweeAlias) {
      params.ExclusiveStartKey = {
        followerAlias: followerAlias,
        followeeAlias: lastFolloweeAlias
      };
    }

    const result = await this.client.query(params).promise();
    const users = await Promise.all(
      (result.Items || []).map(async (item) => {
        const userParams = {
          TableName: "tweeter-users",
          Key: { alias: item.followeeAlias }
        };
        const userResult = await this.client.get(userParams).promise();
        const userData = userResult.Item!;
        return new User(userData.firstName, userData.lastName, userData.alias, userData.imageUrl);
      })
    );
    return [users, !!result.LastEvaluatedKey];
  }

  async getFollowers(followeeAlias: string, limit: number, lastFollowerAlias?: string): Promise<[User[], boolean]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followeeAlias = :followee",
      ExpressionAttributeValues: { ":followee": followeeAlias },
      Limit: limit,
      ScanIndexForward: true
    };

    if (lastFollowerAlias) {
      params.ExclusiveStartKey = {
        followeeAlias: followeeAlias,
        followerAlias: lastFollowerAlias
      };
    }

    const result = await this.client.query(params).promise();
    const users = await Promise.all(
      (result.Items || []).map(async (item) => {
        const userParams = {
          TableName: "tweeter-users",
          Key: { alias: item.followerAlias }
        };
        const userResult = await this.client.get(userParams).promise();
        const userData = userResult.Item!;
        return new User(userData.firstName, userData.lastName, userData.alias, userData.imageUrl);
      })
    );
    return [users, !!result.LastEvaluatedKey];
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const params = {
      TableName: "tweeter-users",
      Key: { alias: followerAlias }
    };
    const result = await this.client.get(params).promise();
    return result.Item?.followeeCount || 0;
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const params = {
      TableName: "tweeter-users",
      Key: { alias: followeeAlias }
    };
    const result = await this.client.get(params).promise();
    return result.Item?.followerCount || 0;
  }

  async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        followerAlias: followerAlias,
        followeeAlias: followeeAlias
      }
    };
    const result = await this.client.get(params).promise();
    return !!result.Item;
  }
}