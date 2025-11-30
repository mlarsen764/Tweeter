import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { FollowService } from "../model/service/FollowService";

export abstract class FollowCountLambda extends BaseLambda<FollowCountRequest, FollowCountResponse> {
  protected extractToken(request: FollowCountRequest): string {
    return request.token;
  }

  protected async executeOperation(request: FollowCountRequest): Promise<FollowCountResponse> {
    const followService = new FollowService(this.daoFactory);
    const count = await this.getCount(followService, request);

    return {
      success: true,
      message: null,
      count: count
    };
  }

  protected abstract getCount(followService: FollowService, request: FollowCountRequest): Promise<number>;
}