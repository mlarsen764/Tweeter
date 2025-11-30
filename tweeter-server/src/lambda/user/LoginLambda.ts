import { LoginRequest, LoginResponse } from "tweeter-shared";
import { BaseLambda } from "../BaseLambda";
import { UserService } from "../../model/service/UserService";

class LoginLambda extends BaseLambda<LoginRequest, LoginResponse> {
  protected extractToken(request: LoginRequest): string {
    return "";
  }

  protected async authenticate(request: LoginRequest): Promise<void> {
    // Skip authentication for login
  }

  protected async executeOperation(request: LoginRequest): Promise<LoginResponse> {
    try {
      const userService = new UserService(this.daoFactory);
      const [user, authToken] = await userService.login(request.alias, request.password);

      return {
        success: true,
        message: null,
        user: user.dto,
        token: authToken.token
      };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      
      if (errorMessage.includes("Invalid alias or password")) {
        throw new Error("[unauthorized] Invalid username or password. Please check your credentials and try again.");
      }
      
      throw new Error("[internal-server-error] An error occurred during login. Please try again.");
    }
  }
}

const handlerInstance = new LoginLambda();
export const handler = (request: LoginRequest): Promise<LoginResponse> => 
  handlerInstance.handle(request);