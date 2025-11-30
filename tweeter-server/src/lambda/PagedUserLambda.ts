import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { FollowService } from "../model/service/FollowService";

export abstract class PagedUserLambda extends BaseLambda<PagedUserItemRequest, PagedUserItemResponse> {
  protected extractToken(request: PagedUserItemRequest): string {
    return request.token;
  }

  protected async executeOperation(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {
    const followService = new FollowService(this.daoFactory);
    const [items, hasMore] = await this.getPagedUsers(followService, request);

    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore
    };
  }

  protected abstract getPagedUsers(followService: FollowService, request: PagedUserItemRequest): Promise<[UserDto[], boolean]>;
}