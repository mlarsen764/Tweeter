import { IsFollowerRequest, IsFollowerResponse, } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const followService = new FollowService(daoFactory);
  const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

  return {
    success: true,
    message: null,
    isFollower: isFollower
  }
}