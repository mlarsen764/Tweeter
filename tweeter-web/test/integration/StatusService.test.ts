import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/network/ServerFacade";
import { AuthToken, User, Status } from "tweeter-shared";
import "isomorphic-fetch";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;
  let authToken: AuthToken;
  let user: User;

  beforeAll(async () => {
    statusService = new StatusService();
    
    // Register a real user to get valid token
    const serverFacade = new ServerFacade();
    const uniqueAlias = "@storyuser" + Date.now();
    [user, authToken] = await serverFacade.register(
      "Story",
      "User",
      uniqueAlias,
      "password123",
      new Uint8Array([1, 2, 3]),
      "jpg"
    );
  });

  test("loadMoreStoryItems - should successfully retrieve story pages", async () => {
    const pageSize = 10;
    const lastItem: Status | null = null;

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      user.alias,
      pageSize,
      lastItem
    );

    expect(Array.isArray(statuses)).toBe(true);
    expect(typeof hasMore).toBe("boolean");
    expect(statuses.length).toBeLessThanOrEqual(pageSize);
    
    statuses.forEach(status => {
      expect(status).toBeInstanceOf(Status);
      expect(status.user).toBeInstanceOf(User);
      expect(typeof status.post).toBe("string");
      expect(typeof status.timestamp).toBe("number");
    });
  });
});