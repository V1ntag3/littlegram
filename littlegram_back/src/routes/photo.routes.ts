import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import { PhotosController } from '@controllers/PhotosController';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticate';
import { EnsureEmailConfirmationMiddleware } from '@shared/middlewares/EnsureEmailConfirmationMiddleware';

import { uploadConfig } from '@config/upload';

const photoRouter = Router();
const photoController = new PhotosController();
const uploadMiddleware = multer(uploadConfig.multer);
const ensureEmailConfirmation = container.resolve(
  EnsureEmailConfirmationMiddleware,
);

photoRouter.delete(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  photoController.delete,
);

photoRouter.post(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  uploadMiddleware.single('photo'),
  photoController.create,
);

photoRouter.post(
  '/multiples',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  uploadMiddleware.array('photos', 10),
  photoController.createMultiple,
);

photoRouter.get(
  '/user/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  photoController.show,
);

export { photoRouter };
