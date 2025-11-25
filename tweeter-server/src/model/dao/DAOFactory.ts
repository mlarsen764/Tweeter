import { UserDAO } from "./UserDAO";
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { S3DAO } from "./S3DAO";

export abstract class DAOFactory {
  abstract getUserDAO(): UserDAO;
  abstract getAuthTokenDAO(): AuthTokenDAO;
  abstract getFollowDAO(): FollowDAO;
  abstract getStatusDAO(): StatusDAO;
  abstract getS3DAO(): S3DAO;
}