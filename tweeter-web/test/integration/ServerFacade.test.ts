import { ServerFacade } from "../../src/network/ServerFacade";
import { 
  PagedUserItemRequest,
  User
} from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let testUser: User;
  let testAuthToken: string;

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    
    // Register a user to get valid token and user for other tests
    [testUser, testAuthToken] = await serverFacade.register(
      "Test",
      "User",
      "@testuser",
      "password123",
      new Uint8Array([1, 2, 3]),
      "jpg"
    );
  });

  test("Register - should successfully register a new user", async () => {
    expect(testUser).toBeInstanceOf(User);
    expect(typeof testUser.firstName).toBe("string");
    expect(typeof testUser.lastName).toBe("string");
    expect(typeof testUser.alias).toBe("string");
    expect(typeof testAuthToken).toBe("string");
  });

  test("GetFollowers - should return followers list", async () => {
    const request: PagedUserItemRequest = {
      token: testAuthToken,
      userAlias: testUser.alias,
      pageSize: 10,
      lastItem: null
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(typeof hasMore).toBe("boolean");
    followers.forEach(follower => {
      expect(follower).toBeInstanceOf(User);
    });
  });

  test("GetFollowingCount - should return following count", async () => {
    const count = await serverFacade.getFolloweeCount(testAuthToken, testUser);

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });

  test("GetFollowersCount - should return followers count", async () => {
    const count = await serverFacade.getFollowerCount(testAuthToken, testUser);

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });
});