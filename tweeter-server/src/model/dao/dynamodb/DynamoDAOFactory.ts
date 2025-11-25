import { DAOFactory } from "../DAOFactory";
import { UserDAO } from "../UserDAO";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { FollowDAO } from "../FollowDAO";
import { StatusDAO } from "../StatusDAO";
import { S3DAO } from "../S3DAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoS3DAO } from "./DynamoS3DAO";

export class DynamoDAOFactory extends DAOFactory {
  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }

  getS3DAO(): S3DAO {
    return new DynamoS3DAO();
  }
}