import { AuthToken, Status, FakeData, StatusDto, User } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";

export class StatusService {
  private daoFactory: DAOFactory;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const statusDAO = this.daoFactory.getStatusDAO();
    const [statuses, hasMore] = await statusDAO.getFeed(userAlias, pageSize, lastItem?.timestamp);
    return [statuses.map(status => status.dto), hasMore];
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const statusDAO = this.daoFactory.getStatusDAO();
    const [statuses, hasMore] = await statusDAO.getStory(userAlias, pageSize, lastItem?.timestamp);
    return [statuses.map(status => status.dto), hasMore];
  };

  private async getFakeData(lastItem: StatusDto | null, pageSize: number, userAlias: string): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(lastItem ? Status.fromDto(lastItem) : null, pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto,
    userAlias: string
  ): Promise<void> {
    const status = Status.fromDto(newStatus);
    if (!status) throw new Error("Invalid status data");
    
    const statusDAO = this.daoFactory.getStatusDAO();
    await statusDAO.createStatus(status);

    // Get followers and add to their feeds
    const followDAO = this.daoFactory.getFollowDAO();
    const [followers] = await followDAO.getFollowers(userAlias, 1000); // Get up to 1000 followers
    const followerAliases = followers.map(follower => follower.alias);
    
    if (followerAliases.length > 0) {
      await statusDAO.addStatusToFeeds(status, followerAliases);
    }
  }
}