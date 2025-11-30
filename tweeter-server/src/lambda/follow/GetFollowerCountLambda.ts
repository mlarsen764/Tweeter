import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowCountLambda } from "../FollowCountLambda";
import { FollowService } from "../../model/service/FollowService";

class GetFollowerCountHandler extends FollowCountLambda {
  protected async getCount(followService: FollowService, request: FollowCountRequest): Promise<number> {
    return await followService.getFollowerCount(request.token, request.user);
  }
}

const handlerInstance = new GetFollowerCountHandler();
export const handler = (request: FollowCountRequest): Promise<FollowCountResponse> => 
  handlerInstance.handle(request);