import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string): Promise<void> {
    try {
      const [user, authToken] = await this.userService.login(alias, password);
      
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      
      if (originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    }
  }
}