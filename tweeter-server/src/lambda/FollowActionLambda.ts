import { FollowRequest, FollowResponse } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { FollowService } from "../model/service/FollowService";

export abstract class FollowActionLambda extends BaseLambda<FollowRequest, FollowResponse> {
  protected extractToken(request: FollowRequest): string {
    return request.token;
  }

  protected async executeOperation(request: FollowRequest): Promise<FollowResponse> {
    const followService = new FollowService(this.daoFactory);
    const [followerCount, followeeCount] = await this.performAction(followService, request);

    return {
      success: true,
      message: this.getSuccessMessage(),
      followerCount: followerCount,
      followeeCount: followeeCount
    };
  }

  protected abstract performAction(followService: FollowService, request: FollowRequest): Promise<[number, number]>;
  protected abstract getSuccessMessage(): string;
}