import { PagedStatusItemRequest, PagedStatusItemResponse, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreFeedItems(AuthToken.fromJson(request.token)!, request.userAlias, request.pageSize, Status.fromDto(request.lastItem));

  return {
    success: true,
    message: null,
    items: items.map(status => status.dto),
    hasMore: hasMore
  }
}