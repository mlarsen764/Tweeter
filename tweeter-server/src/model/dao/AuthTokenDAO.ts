import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
  createAuthToken(token: AuthToken): Promise<void>;
  getAuthToken(token: string): Promise<AuthToken | null>;
  deleteAuthToken(token: string): Promise<void>;
  updateAuthTokenTimestamp(token: string): Promise<void>;
}