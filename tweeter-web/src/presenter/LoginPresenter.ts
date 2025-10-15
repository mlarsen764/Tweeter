import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./Presenter";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  private userService = new UserService();

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string): Promise<void> {
    await this.doAuthenticationOperation(
      () => this.userService.login(alias, password),
      rememberMe,
      "log user in",
      originalUrl
    );
  };
}