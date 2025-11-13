import { ServerFacade } from "../../src/network/ServerFacade";
import { 
  PagedUserItemRequest,
  User,
  AuthToken
} from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let testUser: User;
  let testAuthToken: AuthToken;

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    
    // Register a real user to get valid token and user for other tests
    const uniqueAlias = "@testuser" + Date.now();
    [testUser, testAuthToken] = await serverFacade.register(
      "Test",
      "User",
      uniqueAlias,
      "password123",
      new Uint8Array([1, 2, 3]),
      "jpg"
    );
  });

  test("Register - should successfully register a new user", async () => {
    // This test uses the user registered in beforeAll
    expect(testUser).toBeInstanceOf(User);
    expect(typeof testUser.firstName).toBe("string");
    expect(typeof testUser.lastName).toBe("string");
    expect(typeof testUser.alias).toBe("string");
    expect(testAuthToken).toBeInstanceOf(AuthToken);
  });

  test("GetFollowers - should return followers list", async () => {
    const request: PagedUserItemRequest = {
      token: testAuthToken.toJson(),
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