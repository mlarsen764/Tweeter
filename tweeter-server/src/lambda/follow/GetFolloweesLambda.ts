import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const followService = new FollowService(daoFactory);
  const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore
  }
}