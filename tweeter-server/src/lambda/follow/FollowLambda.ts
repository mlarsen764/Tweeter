import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowActionLambda } from "../FollowActionLambda";
import { FollowService } from "../../model/service/FollowService";

class FollowHandler extends FollowActionLambda {
  protected async performAction(followService: FollowService, request: FollowRequest): Promise<[number, number]> {
    return await followService.follow(request.token, request.userToFollow, request.user.alias);
  }

  protected getSuccessMessage(): string {
    return "Followed User";
  }
}

const handlerInstance = new FollowHandler();
export const handler = (request: FollowRequest): Promise<FollowResponse> => 
  handlerInstance.handle(request);