/**
 * @file storage.service.ts
 * @description Storage Service Singleton.
 * Selects the active StorageProvider based on the STORAGE_DRIVER environment configuration.
 */

import { StorageProvider } from './storage.provider.js';
import { LocalStorageProvider } from './local.storage.js';
import { S3StorageProvider } from './s3.storage.js';
import { env } from '../../config/env.js';

class StorageService {
  private provider: StorageProvider;

  constructor() {
    if (env.STORAGE_DRIVER === 's3' && env.AWS_S3_BUCKET) {
      this.provider = new S3StorageProvider();
    } else {
      this.provider = new LocalStorageProvider();
    }
  }

  getProvider(): StorageProvider {
    return this.provider;
  }
}

export const storageService = new StorageService().getProvider();
