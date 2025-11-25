import { User } from "tweeter-shared";

export interface FollowDAO {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowees(followerAlias: string, limit: number, lastFolloweeAlias?: string): Promise<[User[], boolean]>;
  getFollowers(followeeAlias: string, limit: number, lastFollowerAlias?: string): Promise<[User[], boolean]>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}