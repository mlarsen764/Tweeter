import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda extends BaseLambda<PostStatusRequest, PostStatusResponse> {
  protected extractToken(request: PostStatusRequest): string {
    return request.token;
  }

  protected async executeOperation(request: PostStatusRequest): Promise<PostStatusResponse> {
    const statusService = new StatusService(this.daoFactory);
    await statusService.postStatus(request.token, request.newStatus, request.newStatus.user.alias);

    return {
      success: true,
      message: "Status was posted."
    };
  }
}