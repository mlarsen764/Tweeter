import { IsFollowerRequest, IsFollowerResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
  const followService = new FollowService();
  const user = User.fromDto(request.user)!;
  const selectedUser = User.fromDto(request.selectedUser)!;
  const isFollower = await followService.getIsFollowerStatus(request.token, user, selectedUser);

  return {
    success: true,
    message: null,
    isFollower: isFollower
  }
}