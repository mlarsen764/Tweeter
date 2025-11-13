import { AuthToken, User, LoginRequest, GetUserRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias
    };
    return this.serverFacade.getUser(request);
  };

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request: LoginRequest = { alias, password };
    const [user, token] = await this.serverFacade.login(request);
    return [user, new AuthToken(token, Date.now())];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const [user, token] = await this.serverFacade.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
    return [user, new AuthToken(token, Date.now())];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout(authToken.token);
  }
}