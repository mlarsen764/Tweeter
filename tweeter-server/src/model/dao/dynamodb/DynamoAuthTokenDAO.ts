import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoAuthTokenDAO extends BaseDynamoDAO implements AuthTokenDAO {
  private tableName = "tweeter-auth-tokens";

  async createAuthToken(token: AuthToken): Promise<void> {
    await this.put(this.tableName, {
      token: token.token,
      timestamp: token.timestamp,
      ttl: Math.floor((token.timestamp + 24 * 60 * 60 * 1000) / 1000)
    });
  }

  async getAuthToken(token: string): Promise<AuthToken | null> {
    const result = await this.get<any>(this.tableName, { token });
    return result ? new AuthToken(result.token, result.timestamp) : null;
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.delete(this.tableName, { token });
  }

  async updateAuthTokenTimestamp(token: string): Promise<void> {
    await this.update(
      this.tableName,
      { token },
      "SET #ts = :ts, #ttl = :ttl",
      { ":ts": Date.now(), ":ttl": Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000) },
      { "#ts": "timestamp", "#ttl": "ttl" }
    );
  }
}