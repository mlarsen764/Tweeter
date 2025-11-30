import { LogoutRequest, LogoutResponse, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { AuthorizationService } from "../../model/service/auth/AuthorizationService";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  
  await authService.validateToken(request.token);
  
  const userService = new UserService(daoFactory);
  await userService.logout(request.token);

  return {
    success: true,
    message: "Logged Out"
  }
}