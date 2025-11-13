import { AuthToken, User, UserDto, PagedUserItemRequest, IsFollowerRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.toJson(),
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    return this.serverFacade.getMoreFollowees(request);
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.toJson(),
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    return this.serverFacade.getMoreFollowers(request);
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.toJson(),
      user: user.dto,
      selectedUser: selectedUser.dto
    };
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount(authToken, user);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFollowerCount(authToken, user);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.follow(authToken, userToFollow);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.unfollow(authToken, userToUnfollow);
  }
}