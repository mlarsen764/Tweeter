import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import * as bcrypt from "bcryptjs";

export class AuthorizationService {
  private authTokenDAO: AuthTokenDAO;

  constructor(authTokenDAO: AuthTokenDAO) {
    this.authTokenDAO = authTokenDAO;
  }

  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async validateToken(token: string): Promise<AuthToken> {
    const authToken = await this.authTokenDAO.getAuthToken(token);
    if (!authToken) {
      throw new Error("[unauthorized] Invalid or expired token");
    }

    // Check if token is expired (24 hours)
    const now = Date.now();
    const tokenAge = now - authToken.timestamp;
    const maxAge = 24 * 60 * 60 * 1000;

    if (tokenAge > maxAge) {
      await this.authTokenDAO.deleteAuthToken(token);
      throw new Error("[unauthorized] Token expired");
    }

    // Update timestamp for active tokens
    await this.authTokenDAO.updateAuthTokenTimestamp(token);
    return authToken;
  }

  public generateToken(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2);
  }
}