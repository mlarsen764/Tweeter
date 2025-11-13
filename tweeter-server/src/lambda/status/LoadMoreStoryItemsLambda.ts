import { PagedStatusItemRequest, PagedStatusItemResponse, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();
  const lastItem = request.lastItem ? Status.fromDto(request.lastItem) : null;
  const [items, hasMore] = await statusService.loadMoreStoryItems(AuthToken.fromJson(request.token)!, request.userAlias, request.pageSize, lastItem);

  return {
    success: true,
    message: null,
    items: items.map(status => status.dto),
    hasMore: hasMore
  }
}