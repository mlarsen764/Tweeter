import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  private tableName = "tweeter-auth-tokens";

  async createAuthToken(token: AuthToken): Promise<void> {
    // TODO: Implement DynamoDB put
    throw new Error("Not implemented");
  }

  async getAuthToken(token: string): Promise<AuthToken | null> {
    // TODO: Implement DynamoDB get
    throw new Error("Not implemented");
  }

  async deleteAuthToken(token: string): Promise<void> {
    // TODO: Implement DynamoDB delete
    throw new Error("Not implemented");
  }

  async updateAuthTokenTimestamp(token: string): Promise<void> {
    // TODO: Implement DynamoDB update
    throw new Error("Not implemented");
  }
}