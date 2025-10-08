import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private userService: UserService;
  private view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
    featurePath: string
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());
      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}