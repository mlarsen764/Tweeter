import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  createUser(user: User, hashedPassword: string): Promise<void>;
  getUserWithPassword(alias: string): Promise<{ user: User; hashedPassword: string } | null>;
  getUserByCredentials(alias: string, password: string): Promise<User | null>; // Deprecated
  updateUser(user: User): Promise<void>;
  deleteUser(alias: string): Promise<void>;
}