import { Status, User } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { DynamoDB } from "aws-sdk";

export class DynamoStatusDAO implements StatusDAO {
  private storyTableName = "tweeter-stories";
  private feedTableName = "tweeter-feeds";
  private client = new DynamoDB.DocumentClient();

  async createStatus(status: Status): Promise<void> {
    const params = {
      TableName: this.storyTableName,
      Item: {
        userAlias: status.user.alias,
        timestamp: status.timestamp,
        post: status.post,
        user_firstName: status.user.firstName,
        user_lastName: status.user.lastName,
        user_imageUrl: status.user.imageUrl
      }
    };
    await this.client.put(params).promise();
  }

  async getStory(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.storyTableName,
      KeyConditionExpression: "userAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: limit,
      ScanIndexForward: false
    };

    if (lastStatusTimestamp) {
      params.ExclusiveStartKey = {
        userAlias: userAlias,
        timestamp: lastStatusTimestamp
      };
    }

    const result = await this.client.query(params).promise();
    const statuses = (result.Items || []).map(item => {
      const user = new User(item.user_firstName, item.user_lastName, item.userAlias, item.user_imageUrl);
      return new Status(item.post, user, item.timestamp);
    });
    return [statuses, !!result.LastEvaluatedKey];
  }

  async getFeed(userAlias: string, limit: number, lastStatusTimestamp?: number): Promise<[Status[], boolean]> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.feedTableName,
      KeyConditionExpression: "userAlias = :alias",
      ExpressionAttributeValues: { ":alias": userAlias },
      Limit: limit,
      ScanIndexForward: false
    };

    if (lastStatusTimestamp) {
      params.ExclusiveStartKey = {
        userAlias: userAlias,
        timestamp: lastStatusTimestamp
      };
    }

    const result = await this.client.query(params).promise();
    const statuses = (result.Items || []).map(item => {
      const user = new User(item.user_firstName, item.user_lastName, item.authorAlias, item.user_imageUrl);
      return new Status(item.post, user, item.timestamp);
    });
    return [statuses, !!result.LastEvaluatedKey];
  }

  async addStatusToFeeds(status: Status, followerAliases: string[]): Promise<void> {
    const batchSize = 25;
    for (let i = 0; i < followerAliases.length; i += batchSize) {
      const batch = followerAliases.slice(i, i + batchSize);
      const params = {
        RequestItems: {
          [this.feedTableName]: batch.map(alias => ({
            PutRequest: {
              Item: {
                userAlias: alias,
                timestamp: status.timestamp,
                post: status.post,
                authorAlias: status.user.alias,
                user_firstName: status.user.firstName,
                user_lastName: status.user.lastName,
                user_imageUrl: status.user.imageUrl
              }
            }
          }))
        }
      };
      await this.client.batchWrite(params).promise();
    }
  }
}