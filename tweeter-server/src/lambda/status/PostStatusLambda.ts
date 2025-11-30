import { PostStatusRequest, PostStatusResponse, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const statusService = new StatusService(daoFactory);
  await statusService.postStatus(request.token, request.newStatus, request.newStatus.user.alias);

  return {
    success: true,
    message: "Status was posted."
  }
}