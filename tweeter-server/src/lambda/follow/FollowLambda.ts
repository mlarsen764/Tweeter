import { FollowRequest, FollowResponse, AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const followService = new FollowService();
  const userToFollow = User.fromDto(request.userToFollow)!;
  const [followerCount, followeeCount] = await followService.follow(AuthToken.fromJson(request.token)!, userToFollow);

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount
  }
}