/**
 * @file s3.storage.ts
 * @description Cloud Object Storage Provider (AWS S3 / Cloudflare R2 / MinIO).
 * Pre-configured for direct cloud bucket uploads when AWS credentials are provided.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { StorageProvider, UploadedFilePayload, StoredFileResult } from './storage.provider.js';
import { env } from '../../config/env.js';

export class S3StorageProvider implements StorageProvider {
  private client: S3Client | null = null;
  private bucket: string;
  private region: string;
  private publicUrl: string;

  constructor() {
    this.bucket = env.AWS_S3_BUCKET || 'school-saas-uploads';
    this.region = env.AWS_REGION || 'auto';
    this.publicUrl = env.AWS_S3_PUBLIC_URL?.replace(/\/$/, '') || '';

    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      let endpoint = env.AWS_S3_ENDPOINT?.replace(/\/+$/, '') || undefined;
      // If endpoint accidentally had the bucket name appended, strip it
      if (endpoint && this.bucket && endpoint.endsWith(`/${this.bucket}`)) {
        endpoint = endpoint.slice(0, -(this.bucket.length + 1));
      }

      this.client = new S3Client({
        region: this.region,
        endpoint,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  async saveFile(file: UploadedFilePayload, category: string = 'general'): Promise<StoredFileResult> {
    const cleanCategory = category.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'general';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${cleanCategory}/${uniqueSuffix}-${sanitizedOriginal}`;

    if (this.client) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.client.send(command);
    }

    // Build the public URL for the file
    let url = '';
    if (this.publicUrl) {
      url = `${this.publicUrl}/${filename}`;
    } else if (env.AWS_S3_ENDPOINT) {
      url = `${env.AWS_S3_ENDPOINT.replace(/\/$/, '')}/${this.bucket}/${filename}`;
    } else {
      url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filename}`;
    }

    return {
      url,
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      category: cleanCategory,
    };
  }

  async deleteFile(fileUrlOrKey: string): Promise<boolean> {
    if (!this.client) return true;
    try {
      // Extract key if a full URL was provided
      let key = fileUrlOrKey;
      if (key.startsWith('http://') || key.startsWith('https://')) {
        const parsed = new URL(key);
        key = parsed.pathname.replace(/^\/+/, '');
        // If the pathname includes the bucket name at the beginning, strip it
        if (key.startsWith(`${this.bucket}/`)) {
          key = key.substring(this.bucket.length + 1);
        }
      }

      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      // If the URL or key contained the bucket prefix, also delete the prefixed key in case it was uploaded earlier
      if (fileUrlOrKey.includes(`${this.bucket}/`)) {
        await this.client.send(
          new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: `${this.bucket}/${key}`,
          })
        ).catch(() => null);
      }
      return true;
    } catch (error) {
      console.error('Failed to delete file from S3 / R2 storage:', error);
      return false;
    }
  }
}
