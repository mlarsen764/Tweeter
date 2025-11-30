import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { PagedUserLambda } from "../PagedUserLambda";
import { FollowService } from "../../model/service/FollowService";

class GetFollowersHandler extends PagedUserLambda {
  protected async getPagedUsers(followService: FollowService, request: PagedUserItemRequest): Promise<[UserDto[], boolean]> {
    return await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
  }
}

const handlerInstance = new GetFollowersHandler();
export const handler = (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => 
  handlerInstance.handle(request);