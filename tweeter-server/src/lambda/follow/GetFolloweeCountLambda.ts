import { FollowCountRequest, FollowCountResponse, } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const followService = new FollowService(daoFactory);
  const count = await followService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: count
  }
}