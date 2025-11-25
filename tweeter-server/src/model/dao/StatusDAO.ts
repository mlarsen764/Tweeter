import { Status } from "tweeter-shared";

export interface StatusDAO {
  createStatus(status: Status): Promise<void>;
  getStory(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]>;
  getFeed(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]>;
  addStatusToFeeds(status: Status, followerAliases: string[]): Promise<void>;
}