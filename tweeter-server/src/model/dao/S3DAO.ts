export interface S3DAO {
  uploadImage(imageBytes: Uint8Array, fileName: string): Promise<string>;
  deleteImage(fileName: string): Promise<void>;
}