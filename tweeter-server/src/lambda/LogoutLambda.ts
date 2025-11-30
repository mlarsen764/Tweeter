import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { BaseLambda } from "./BaseLambda";
import { UserService } from "../model/service/UserService";

export class LogoutLambda extends BaseLambda<LogoutRequest, LogoutResponse> {
  protected extractToken(request: LogoutRequest): string {
    return request.token;
  }

  protected async executeOperation(request: LogoutRequest): Promise<LogoutResponse> {
    const userService = new UserService(this.daoFactory);
    await userService.logout(request.token);

    return {
      success: true,
      message: "Logged Out"
    };
  }
}