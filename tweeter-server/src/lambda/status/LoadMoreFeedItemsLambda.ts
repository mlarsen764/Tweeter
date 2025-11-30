import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared";
import { PagedStatusLambda } from "../PagedStatusLambda";
import { StatusService } from "../../model/service/StatusService";

class LoadMoreFeedItemsHandler extends PagedStatusLambda {
  protected async getPagedStatuses(statusService: StatusService, request: PagedStatusItemRequest): Promise<[StatusDto[], boolean]> {
    return await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
  }
}

const handlerInstance = new LoadMoreFeedItemsHandler();
export const handler = (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => 
  handlerInstance.handle(request);