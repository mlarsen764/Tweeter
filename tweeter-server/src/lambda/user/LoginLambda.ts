import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
  try {
    const daoFactory = new DynamoDAOFactory();
    const userService = new UserService(daoFactory);
    const [user, authToken] = await userService.login(request.alias, request.password);

    return {
      success: true,
      message: null,
      user: user.dto,
      token: authToken.token
    }
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
    
    // Check if it's an invalid credentials error
    if (errorMessage.includes("Invalid alias or password")) {
      throw new Error("[unauthorized] Invalid username or password. Please check your credentials and try again.");
    }
    
    // For other errors, throw with internal server error prefix
    throw new Error("[internal-server-error] An error occurred during login. Please try again.");
  }
}