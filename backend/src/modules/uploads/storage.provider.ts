/**
 * @file storage.provider.ts
 * @description Storage Provider Contract.
 * Allows switching between Local Filesystem, AWS S3, Cloudinary, or MinIO transparently.
 */

export interface UploadedFilePayload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface StoredFileResult {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  category: string;
}

export interface StorageProvider {
  saveFile(file: UploadedFilePayload, category?: string): Promise<StoredFileResult>;
  deleteFile(fileUrlOrKey: string): Promise<boolean>;
}
