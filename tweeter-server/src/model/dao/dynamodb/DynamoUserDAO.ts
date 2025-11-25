import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";

export class DynamoUserDAO implements UserDAO {
  private tableName = "tweeter-users";

  async getUser(alias: string): Promise<User | null> {
    // TODO: Implement DynamoDB query
    throw new Error("Not implemented");
  }

  async createUser(user: User, hashedPassword: string): Promise<void> {
    // TODO: Implement DynamoDB put
    throw new Error("Not implemented");
  }

  async getUserByCredentials(alias: string, password: string): Promise<User | null> {
    // TODO: Implement DynamoDB query with password verification
    throw new Error("Not implemented");
  }

  async updateUser(user: User): Promise<void> {
    // TODO: Implement DynamoDB update
    throw new Error("Not implemented");
  }

  async deleteUser(alias: string): Promise<void> {
    // TODO: Implement DynamoDB delete
    throw new Error("Not implemented");
  }
}