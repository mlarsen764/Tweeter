import { FollowRequest, FollowResponse, AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const followService = new FollowService();
  const userToUnfollow = User.fromDto(request.userToFollow)!;
  const [followerCount, followeeCount] = await followService.unfollow(AuthToken.fromJson(request.token)!, userToUnfollow);

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount
  }
}