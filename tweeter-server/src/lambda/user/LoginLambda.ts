import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const userService = new UserService(daoFactory);
  const [user, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: null,
    user: user.dto,
    token: authToken.toJson()
  }
}