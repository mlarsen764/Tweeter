import { AuthToken, User } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./auth/AuthorizationService";

export class UserService {
  private daoFactory: DAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
    this.authService = new AuthorizationService(daoFactory.getAuthTokenDAO());
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    await this.authService.validateToken(token);
    return await this.daoFactory.getUserDAO().getUser(alias);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const user = await this.daoFactory.getUserDAO().getUserByCredentials(alias, password);
    if (!user) {
      throw new Error("Invalid alias or password");
    }

    const tokenString = this.authService.generateToken();
    const authToken = new AuthToken(tokenString, Date.now());
    await this.daoFactory.getAuthTokenDAO().createAuthToken(authToken);

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    if (!/^@[a-zA-Z0-9_]+$/.test(alias)) {
      throw new Error("Alias can only contain letters, numbers, and underscores");
    }

    const existingUser = await this.daoFactory.getUserDAO().getUser(alias);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const imageUrl = await this.daoFactory.getS3DAO().uploadImage(userImageBytes, `${alias}.${imageFileExtension}`);
    const hashedPassword = await this.authService.hashPassword(password);
    const user = new User(firstName, lastName, alias, imageUrl);
    
    await this.daoFactory.getUserDAO().createUser(user, hashedPassword);

    const tokenString = this.authService.generateToken();
    const authToken = new AuthToken(tokenString, Date.now());
    await this.daoFactory.getAuthTokenDAO().createAuthToken(authToken);

    return [user, authToken];
  }

  public async logout(token: string): Promise<void> {
    await this.authService.validateToken(token);
    await this.daoFactory.getAuthTokenDAO().deleteAuthToken(token);
  }
}