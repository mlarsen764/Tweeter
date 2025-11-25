import { Status } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";

export class DynamoStatusDAO implements StatusDAO {
  private storyTableName = "tweeter-stories";
  private feedTableName = "tweeter-feeds";

  async createStatus(status: Status): Promise<void> {
    // TODO: Implement DynamoDB put to stories table
    throw new Error("Not implemented");
  }

  async getStory(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]> {
    // TODO: Implement DynamoDB query
    throw new Error("Not implemented");
  }

  async getFeed(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]> {
    // TODO: Implement DynamoDB query
    throw new Error("Not implemented");
  }

  async addStatusToFeeds(status: Status, followerAliases: string[]): Promise<void> {
    // TODO: Implement batch write to feeds table
    throw new Error("Not implemented");
  }
}