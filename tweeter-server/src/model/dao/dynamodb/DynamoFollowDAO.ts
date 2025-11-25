import { User } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";

export class DynamoFollowDAO implements FollowDAO {
  private tableName = "tweeter-follows";

  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    // TODO: Implement DynamoDB put
    throw new Error("Not implemented");
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    // TODO: Implement DynamoDB delete
    throw new Error("Not implemented");
  }

  async getFollowees(followerAlias: string, limit: number, lastFolloweeAlias?: string): Promise<[User[], boolean]> {
    // TODO: Implement DynamoDB query
    throw new Error("Not implemented");
  }

  async getFollowers(followeeAlias: string, limit: number, lastFollowerAlias?: string): Promise<[User[], boolean]> {
    // TODO: Implement DynamoDB query
    throw new Error("Not implemented");
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    // TODO: Implement DynamoDB count
    throw new Error("Not implemented");
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    // TODO: Implement DynamoDB count
    throw new Error("Not implemented");
  }

  async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    // TODO: Implement DynamoDB get
    throw new Error("Not implemented");
  }
}