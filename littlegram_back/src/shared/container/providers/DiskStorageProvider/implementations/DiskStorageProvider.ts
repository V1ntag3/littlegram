import fs from 'fs';
import path from 'path';

import { uploadConfig } from '@config/upload';
import { IStorageProvider } from '../models/IStorageProvider';

export class DiskStorageProvider implements IStorageProvider {
  public async saveAvatarFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.avatarFolder, file),
    );

    return file;
  }

  public async savePhotoFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.photosFolder, file),
    );

    return file;
  }

  public async deleteAvatarFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.avatarFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

  public async deletePhotoFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.photosFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

  public async deleteTmpFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.tmpFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
