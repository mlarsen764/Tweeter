import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const token = authToken.token;
    return this.serverFacade.loadMoreFeedItems(token, userAlias, pageSize, lastItem);
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const token = authToken.token;
    return this.serverFacade.loadMoreStoryItems(token, userAlias, pageSize, lastItem);
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const token = authToken.token;
    return this.serverFacade.postStatus(token, newStatus);
  }
}