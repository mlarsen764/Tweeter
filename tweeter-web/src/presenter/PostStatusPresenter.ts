import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, LoadingView } from "./Presenter";

export interface PostStatusView extends LoadingView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService = new StatusService();

  public async submitPost(post: string, currentUser: User, authToken: AuthToken): Promise<void> {
    let postingStatusToastId = "";
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());
      await this.statusService.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }, "post the status");
  }

  public clearPost(): void {
    this.view.setPost("");
  }
}