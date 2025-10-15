import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, LoadingView, NavigationView } from "./Presenter";

export interface UserInfoView extends LoadingView, NavigationView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService = new FollowService();

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser);
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.setCount(
      () => this.followService.getFolloweeCount(authToken, displayedUser),
      (count) => this.view.setFolloweeCount(count),
      'get followees count'
    );
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.setCount(
      () => this.followService.getFollowerCount(authToken, displayedUser),
      (count) => this.view.setFollowerCount(count),
      'get followers count'
    );
  }

  private async setCount(
    getCount: () => Promise<number>,
    setCount: (count: number) => void,
    operationDescription: string
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count = await getCount();
      setCount(count);
    }, operationDescription);
  }

  public switchToLoggedInUser(currentUser: User, baseUrl: string): void {
    this.view.setDisplayedUser(currentUser);
    this.view.navigate(`${baseUrl}/${currentUser.alias}`);
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.updateFollowStatus(
      () => this.followService.follow(authToken, displayedUser),
      true,
      `Following ${displayedUser.name}...`,
      "follow user"
    );
  }

  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.updateFollowStatus(
      () => this.followService.unfollow(authToken, displayedUser),
      false,
      `Unfollowing ${displayedUser.name}...`,
      "unfollow user"
    );
  }

  private async updateFollowStatus(
    followOperation: () => Promise<[number, number]>,
    isFollower: boolean,
    toastMessage: string,
    operationDescription: string
  ): Promise<void> {
    let toast = "";
    await this.doFailureReportingOperationWithCleanup(
      async () => {
        this.view.setIsLoading(true);
        toast = this.view.displayInfoMessage(toastMessage, 0);

        const [followerCount, followeeCount] = await followOperation();

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      () => {
        this.view.deleteMessage(toast);
        this.view.setIsLoading(false);
      },
      operationDescription
    );
  }
}