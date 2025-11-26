import { 
  User, 
  Status,
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
  private SERVER_URL = "https://q0iodg5ev5.execute-api.us-west-2.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // User operations
  public async login(request: LoginRequest): Promise<[User, string]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
      request, "/user/login"
    );

    if (response.success) {
      const user = User.fromDto(response.user!);
      if (user && response.token) {
        return [user, response.token];
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
  ): Promise<[User, string]> {
    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: (() => {
        let binary = '';
        for (let i = 0; i < userImageBytes.length; i++) {
          binary += String.fromCharCode(userImageBytes[i]);
        }
        return btoa(binary);
      })(),
      imageFileExtension
    };
    const response = await this.clientCommunicator.doPost<RegisterRequest, RegisterResponse>(
      request, "/user/create"
    );
    
    if (response.success) {
      return [User.fromDto(response.user!)!, response.token!];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Registration failed');
    }
  }

  async logout(token: string): Promise<void> {
    const request: LogoutRequest = { token };
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

  async getFolloweeCount(token: string, user: User): Promise<number> {
    const request: FollowCountRequest = {
      token,
      user: user.dto
    };
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(
      request, "/follow/followeecount"
    );
    return response.count;
  }

  async getFollowerCount(token: string, user: User): Promise<number> {
    const request: FollowCountRequest = {
      token,
      user: user.dto
    };
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(
      request, "/follow/followercount"
    );
    return response.count;
  }

  async follow(token: string, userToFollow: User): Promise<[number, number]> {
    const request: FollowRequest = {
      token,
      userToFollow: userToFollow.dto
    };
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request, "/follow/followuser"
    );
    return [response.followerCount, response.followeeCount];
  }

  async unfollow(token: string, userToUnfollow: User): Promise<[number, number]> {
    const request: FollowRequest = {
      token,
      userToFollow: userToUnfollow.dto
    };
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request, "/follow/unfollowuser"
    );
    return [response.followerCount, response.followeeCount];
  }

  // Status operations
  async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request, "/status/loadfeeditems"
    );
    
    if (response.success) {
      const items = response.items ? response.items.map(dto => Status.fromDto(dto)).filter(status => status !== null) as Status[] : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to load feed items');
    }
  }

  async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request, "/status/loadstoryitems"
    );
    
    if (response.success) {
      const items = response.items ? response.items.map(dto => Status.fromDto(dto)).filter(status => status !== null) as Status[] : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to load story items');
    }
  }

  async postStatus(token: string, newStatus: Status): Promise<void> {
    const request: PostStatusRequest = {
      token,
      newStatus: newStatus.dto
    };
    await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(
      request, "/status/poststatus"
    );
  }
}