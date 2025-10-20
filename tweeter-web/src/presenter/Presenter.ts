import { AuthToken, User } from "tweeter-shared";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export interface LoadingView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
}

export interface NavigationView extends View {
  navigate: (url: string) => void;
}

export interface AuthenticationView extends NavigationView {
  updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`,
      );
    }
  }

  protected async doFailureReportingOperationWithCleanup(
    operation: () => Promise<void>,
    cleanup: () => void,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`,
      );
    } finally {
      cleanup();
    }
  }

}