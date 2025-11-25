import { LogoutRequest, LogoutResponse, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const userService = new UserService(daoFactory);
  await userService.logout(request.token);

  return {
    success: true,
    message: "Logged Out"
  }
}