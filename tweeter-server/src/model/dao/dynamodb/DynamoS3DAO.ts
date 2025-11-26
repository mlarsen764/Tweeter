import { S3DAO } from "../S3DAO";
import { S3 } from "aws-sdk";

export class DynamoS3DAO implements S3DAO {
  private bucketName = "tweeter-profile-images-mattm-cs340";
  private s3 = new S3({ region: 'us-east-1' });

  async uploadImage(imageBytes: Uint8Array, fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: imageBytes,
      ContentType: 'image/jpeg'
    };
    
    await this.s3.upload(params).promise();
    return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
  }

  async deleteImage(fileName: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    
    await this.s3.deleteObject(params).promise();
  }
}