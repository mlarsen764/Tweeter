import { FollowCountRequest, FollowCountResponse, AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
  const followService = new FollowService();
  const user = User.fromDto(request.user)!;
  const count = await followService.getFolloweeCount(AuthToken.fromJson(request.token)!, user);

  return {
    success: true,
    message: null,
    count: count
  }
}