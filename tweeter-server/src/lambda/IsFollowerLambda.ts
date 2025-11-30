import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { FollowService } from "../model/service/FollowService";

export class IsFollowerLambda extends BaseLambda<IsFollowerRequest, IsFollowerResponse> {
  protected extractToken(request: IsFollowerRequest): string {
    return request.token;
  }

  protected async executeOperation(request: IsFollowerRequest): Promise<IsFollowerResponse> {
    const followService = new FollowService(this.daoFactory);
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
      success: true,
      message: null,
      isFollower: isFollower
    };
  }
}