import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const daoFactory = new DynamoDAOFactory();
    const userService = new UserService(daoFactory);
    const userImageBytes = new Uint8Array(Buffer.from(request.userImageBytes, 'base64'));
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      userImageBytes,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user: user.dto,
      token: authToken.token
    }
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
    
    if (errorMessage.includes("User already exists")) {
      throw new Error("[bad-request] A user with this alias already exists. Please choose a different alias.");
    }
    
    if (errorMessage.includes("Alias can only contain")) {
      throw new Error("[bad-request] Alias can only contain letters, numbers, and underscores.");
    }
    
    throw new Error("[internal-server-error] Registration failed. Please try again.");
  }
}