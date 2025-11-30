import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowCountLambda } from "../FollowCountLambda";
import { FollowService } from "../../model/service/FollowService";

class GetFolloweeCountHandler extends FollowCountLambda {
  protected async getCount(followService: FollowService, request: FollowCountRequest): Promise<number> {
    return await followService.getFolloweeCount(request.token, request.user);
  }
}

const handlerInstance = new GetFolloweeCountHandler();
export const handler = (request: FollowCountRequest): Promise<FollowCountResponse> => 
  handlerInstance.handle(request);