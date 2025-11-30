import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";

export class FollowService {
  private daoFactory: DAOFactory;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const [users, hasMore] = await followDAO.getFollowees(userAlias, pageSize, lastItem?.alias);
    return [users.map(user => user.dto), hasMore];
  };

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const followDAO = this.daoFactory.getFollowDAO();
    const [users, hasMore] = await followDAO.getFollowers(userAlias, pageSize, lastItem?.alias);
    return [users.map(user => user.dto), hasMore];
  };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto,
  ): Promise<boolean> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto,
  ): Promise<number> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto,
  ): Promise<number> {
    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    await followDAO.follow(userAlias, userToFollow.alias);

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const currentUserDto = { alias: userAlias } as UserDto;
    const followeeCount = await this.getFolloweeCount(token, currentUserDto);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followDAO = this.daoFactory.getFollowDAO();
    await followDAO.unfollow(userAlias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const currentUserDto = { alias: userAlias } as UserDto;
    const followeeCount = await this.getFolloweeCount(token, currentUserDto);

    return [followerCount, followeeCount];
  }
}