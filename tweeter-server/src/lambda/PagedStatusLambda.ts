import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { StatusService } from "../model/service/StatusService";

export abstract class PagedStatusLambda extends BaseLambda<PagedStatusItemRequest, PagedStatusItemResponse> {
  protected extractToken(request: PagedStatusItemRequest): string {
    return request.token;
  }

  protected async executeOperation(request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> {
    const statusService = new StatusService(this.daoFactory);
    const [items, hasMore] = await this.getPagedStatuses(statusService, request);

    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore
    };
  }

  protected abstract getPagedStatuses(statusService: StatusService, request: PagedStatusItemRequest): Promise<[StatusDto[], boolean]>;
}