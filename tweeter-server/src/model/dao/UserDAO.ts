import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  createUser(user: User, hashedPassword: string): Promise<void>;
  getUserByCredentials(alias: string, password: string): Promise<User | null>;
  updateUser(user: User): Promise<void>;
  deleteUser(alias: string): Promise<void>;
}