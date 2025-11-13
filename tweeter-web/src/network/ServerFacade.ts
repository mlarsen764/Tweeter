import { 
  AuthToken, 
  User, 
  Status,
  UserDto,
  StatusDto,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
  GetUserRequest,
  GetUserResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  FollowCountRequest,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  PostStatusResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://your-api-gateway-url.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // User operations
  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
      request, "/user/login"
    );

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromJson(response.token);
      if (user && authToken) {
        return [user, authToken];
      } else {
        throw new Error('Invalid login response');
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Login failed');
    }
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: btoa(String.fromCharCode(...userImageBytes)),
      imageFileExtension
    };
    const response = await this.clientCommunicator.doPost<RegisterRequest, RegisterResponse>(
      request, "/user/create"
    );
    return [User.fromDto(response.user)!, AuthToken.fromJson(response.token)!];
  }

  async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = { token: authToken.toJson() };
    await this.clientCommunicator.doPost<LogoutRequest, LogoutResponse>(
      request, "/user/logout"
    );
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(
      request, "/user/get"
    );

    if (response.success) {
      return response.user ? User.fromDto(response.user) : null;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get user');
    }
  }

  // Follow operations
  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/loadfollowees");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/loadfollowers");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<IsFollowerRequest, IsFollowerResponse>(
      request, "/follow/isfollower"
    );

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get follower status');
    }
  }

  async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.toJson(),
      user: user.dto
    };
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(
      request, "/follow/followeecount"
    );
    return response.count;
  }

  async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.toJson(),
      user: user.dto
    };
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(
      request, "/follow/followercount"
    );
    return response.count;
  }

  async follow(authToken: AuthToken, userToFollow: User): Promise<[number, number]> {
    const request: FollowRequest = {
      token: authToken.toJson(),
      userToFollow: userToFollow.dto
    };
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request, "/follow/followuser"
    );
    return [response.followerCount, response.followeeCount];
  }

  async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[number, number]> {
    const request: FollowRequest = {
      token: authToken.toJson(),
      userToFollow: userToUnfollow.dto
    };
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request, "/follow/unfollowuser"
    );
    return [response.followerCount, response.followeeCount];
  }

  // Status operations
  async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.toJson(),
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request, "/status/loadfeeditems"
    );
    return [response.items.map(dto => Status.fromDto(dto)!), response.hasMore];
  }

  async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.toJson(),
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request, "/status/loadstoryitems"
    );
    return [response.items.map(dto => Status.fromDto(dto)!), response.hasMore];
  }

  async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.toJson(),
      newStatus: newStatus.dto
    };
    await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(
      request, "/status/poststatus"
    );
  }
}