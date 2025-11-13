import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
  const userService = new UserService();
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
    token: authToken.toJson()
  }
}