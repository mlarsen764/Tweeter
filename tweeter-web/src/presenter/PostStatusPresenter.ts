import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, LoadingView } from "./Presenter";

export interface PostStatusView extends LoadingView {
  setPost: (post: string) => void;
  bumpStoryVersion?: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get service() {
    return this._statusService;
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken): Promise<void> {
    let postingStatusToastId = "";
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());
      await this.service.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
      
      // Refresh story to show new post immediately
      if (this.view.bumpStoryVersion) {
        console.log('Bumping story version after post');
        this.view.bumpStoryVersion();
      } else {
        console.log('No story version bump function available');
      }
    }, "post the status");
  }

  public clearPost(): void {
    this.view.setPost("");
  }
}