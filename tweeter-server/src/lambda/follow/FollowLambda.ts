import { FollowRequest, FollowResponse, } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const followService = new FollowService(daoFactory);
  const [followerCount, followeeCount] = await followService.follow(request.token, request.userToFollow, request.user.alias);

  return {
    success: true,
    message: "Followed User",
    followerCount: followerCount,
    followeeCount: followeeCount
  }
}