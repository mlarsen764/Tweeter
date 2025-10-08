import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
}

export class UserInfoPresenter {
  private followService: FollowService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<void> {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser);
        this.view.setIsFollower(isFollower);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const count = await this.followService.getFolloweeCount(authToken, displayedUser);
      this.view.setFolloweeCount(count);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const count = await this.followService.getFollowerCount(authToken, displayedUser);
      this.view.setFollowerCount(count);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
    }
  }

  public switchToLoggedInUser(currentUser: User, baseUrl: string): void {
    this.view.setDisplayedUser(currentUser);
    this.view.navigate(`${baseUrl}/${currentUser.alias}`);
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    let followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(authToken, displayedUser);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    let unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(authToken, displayedUser);

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }
}