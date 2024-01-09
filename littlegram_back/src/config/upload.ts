import path from 'path';
import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'images');

interface IUploadConfig {
  driver: 'disk';

  tmpFolder: string;
  avatarFolder: string;
  photosFolder: string;
  bytesSizeLimit: number;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: object;
  };
}

export const uploadConfig = {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  avatarFolder: path.resolve(tmpFolder, 'uploads', 'avatar'),
  photosFolder: path.resolve(tmpFolder, 'uploads', 'photos'),
  bytesSizeLimit: 10000000,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`.trim();

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
  },
} as IUploadConfig;
