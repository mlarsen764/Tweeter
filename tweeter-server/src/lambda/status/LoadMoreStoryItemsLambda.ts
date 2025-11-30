import { PagedStatusItemRequest, PagedStatusItemResponse, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const statusService = new StatusService(daoFactory);
  const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore
  }
}