import { GetUserRequest, GetUserResponse, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const daoFactory = new DynamoDAOFactory();
  const userService = new UserService(daoFactory);
  const user = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: user ? user.dto : null
  }
}