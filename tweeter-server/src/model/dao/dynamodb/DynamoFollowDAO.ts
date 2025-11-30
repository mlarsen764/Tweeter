import { User } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoFollowDAO extends BaseDynamoDAO implements FollowDAO {
  private tableName = "tweeter-follows";
  private indexName = "followeeAlias-followerAlias-index";

  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.put(this.tableName, { followerAlias, followeeAlias });
    
    await this.update("tweeter-users", { alias: followeeAlias }, "ADD followerCount :inc", { ":inc": 1 });
    await this.update("tweeter-users", { alias: followerAlias }, "ADD followeeCount :inc", { ":inc": 1 });
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.delete(this.tableName, { followerAlias, followeeAlias });
    
    await this.update("tweeter-users", { alias: followeeAlias }, "ADD followerCount :dec", { ":dec": -1 });
    await this.update("tweeter-users", { alias: followerAlias }, "ADD followeeCount :dec", { ":dec": -1 });
  }

  async getFollowees(followerAlias: string, limit: number, lastFolloweeAlias?: string): Promise<[User[], boolean]> {
    const params: any = {
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

    const result = await this.query(params);
    const users = await Promise.all(
      (result.Items || []).map(async (item) => {
        const userData = await this.get<any>("tweeter-users", { alias: item.followeeAlias });
        return new User(userData!.firstName, userData!.lastName, userData!.alias, userData!.imageUrl);
      })
    );
    return [users, !!result.LastEvaluatedKey];
  }

  async getFollowers(followeeAlias: string, limit: number, lastFollowerAlias?: string): Promise<[User[], boolean]> {
    const params: any = {
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

    const result = await this.query(params);
    const users = await Promise.all(
      (result.Items || []).map(async (item) => {
        const userData = await this.get<any>("tweeter-users", { alias: item.followerAlias });
        return new User(userData!.firstName, userData!.lastName, userData!.alias, userData!.imageUrl);
      })
    );
    return [users, !!result.LastEvaluatedKey];
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const result = await this.get<any>("tweeter-users", { alias: followerAlias });
    return result?.followeeCount || 0;
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const result = await this.get<any>("tweeter-users", { alias: followeeAlias });
    return result?.followerCount || 0;
  }

  async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const result = await this.get<any>(this.tableName, { followerAlias, followeeAlias });
    return !!result;
  }
}