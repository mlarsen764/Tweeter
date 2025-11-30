import { GetUserRequest, GetUserResponse, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const userService = new UserService(daoFactory);
  const user = await userService.getUser(request.token, request.alias);

  if (!user) {
    throw new Error("[bad-request] User not found");
  }

  return {
    success: true,
    message: null,
    user: user.dto
  }
}