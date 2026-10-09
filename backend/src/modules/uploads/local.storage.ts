/**
 * @file local.storage.ts
 * @description Local Filesystem Storage Provider.
 * Stores files in the server's uploads/ folder and serves them via static Express middleware.
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider, UploadedFilePayload, StoredFileResult } from './storage.provider.js';
import { env } from '../../config/env.js';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), env.UPLOAD_DIR || 'uploads');
  }

  async saveFile(file: UploadedFilePayload, category: string = 'general'): Promise<StoredFileResult> {
    const cleanCategory = category.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'general';
    const targetDir = path.join(this.baseDir, cleanCategory);

    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Generate unique, collision-proof filename
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const safeBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const filename = `${safeBaseName}-${uniqueSuffix}${ext}`;
    const filePath = path.join(targetDir, filename);

    // Write buffer to disk
    await fs.writeFile(filePath, file.buffer);

    // Public URL accessible via Express static handler
    const url = `/uploads/${cleanCategory}/${filename}`;

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
    try {
      // Remove '/uploads/' prefix to locate the file on disk
      const relativePath = fileUrlOrKey.startsWith('/uploads/')
        ? fileUrlOrKey.replace('/uploads/', '')
        : fileUrlOrKey;
      const targetPath = path.join(this.baseDir, relativePath);

      // Verify the path is within baseDir (security prevention against path traversal)
      if (!targetPath.startsWith(this.baseDir)) {
        return false;
      }

      await fs.unlink(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}
