import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { BaseDynamoDAO } from "./BaseDynamoDAO";

export class DynamoUserDAO extends BaseDynamoDAO implements UserDAO {
  private tableName = "tweeter-users";

  async getUser(alias: string): Promise<User | null> {
    const result = await this.get<any>(this.tableName, { alias });
    return result ? new User(result.firstName, result.lastName, result.alias, result.imageUrl) : null;
  }

  async createUser(user: User, hashedPassword: string): Promise<void> {
    await this.put(this.tableName, {
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      hashedPassword,
      followerCount: 0,
      followeeCount: 0
    });
  }

  async getUserWithPassword(alias: string): Promise<{ user: User; hashedPassword: string } | null> {
    const result = await this.get<any>(this.tableName, { alias });
    if (!result) return null;
    
    const user = new User(result.firstName, result.lastName, result.alias, result.imageUrl);
    return { user, hashedPassword: result.hashedPassword };
  }

  async getUserByCredentials(alias: string, password: string): Promise<User | null> {
    // This method is deprecated - use getUserWithPassword and AuthorizationService instead
    throw new Error("Use getUserWithPassword and AuthorizationService for credential verification");
  }

  async updateUser(user: User): Promise<void> {
    await this.update(
      this.tableName,
      { alias: user.alias },
      "SET firstName = :fn, lastName = :ln, imageUrl = :img",
      { ":fn": user.firstName, ":ln": user.lastName, ":img": user.imageUrl }
    );
  }

  async deleteUser(alias: string): Promise<void> {
    await this.delete(this.tableName, { alias });
  }
}