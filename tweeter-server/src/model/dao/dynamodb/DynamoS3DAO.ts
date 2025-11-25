import { S3DAO } from "../S3DAO";

export class DynamoS3DAO implements S3DAO {
  private bucketName = "tweeter-profile-images";

  async uploadImage(imageBytes: Uint8Array, fileName: string): Promise<string> {
    // TODO: Implement S3 upload
    throw new Error("Not implemented");
  }

  async deleteImage(fileName: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new Error("Not implemented");
  }
}