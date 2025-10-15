import { AuthToken, User } from "tweeter-shared";
import { Presenter, AuthenticationView } from "./Presenter";

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
  protected async doAuthenticationOperation(
    authOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    operationDescription: string,
    navigationUrl?: string
  ) {
    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await authOperation();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(navigationUrl || `/feed/${user.alias}`);
    }, operationDescription);
  }
}