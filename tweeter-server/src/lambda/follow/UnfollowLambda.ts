import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowActionLambda } from "../FollowActionLambda";
import { FollowService } from "../../model/service/FollowService";

class UnfollowHandler extends FollowActionLambda {
  protected async performAction(followService: FollowService, request: FollowRequest): Promise<[number, number]> {
    return await followService.unfollow(request.token, request.userToFollow, request.user.alias);
  }

  protected getSuccessMessage(): string {
    return "Unfollowed User";
  }
}

const handlerInstance = new UnfollowHandler();
export const handler = (request: FollowRequest): Promise<FollowResponse> => 
  handlerInstance.handle(request);