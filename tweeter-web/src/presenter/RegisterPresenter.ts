import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class RegisterPresenter {
  private userService: UserService;
  private view: RegisterView;

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ): Promise<void> {
    try {
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );
      
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    }
  }
}