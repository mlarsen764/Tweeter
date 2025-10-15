import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, NavigationView } from "./Presenter";

export interface UserNavigationView extends NavigationView {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService = new UserService();

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
    featurePath: string
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());
      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  };

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}