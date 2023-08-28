import { Router } from 'express';
import { container } from 'tsyringe';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticate';
import { EnsureEmailConfirmationMiddleware } from '@shared/middlewares/EnsureEmailConfirmationMiddleware';

import { PostsController } from '@controllers/PostsController';

const postRouter = Router();
const postController = new PostsController();
const ensureEmailConfirmation = container.resolve(
  EnsureEmailConfirmationMiddleware,
);

postRouter.post(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postController.create,
);

postRouter.get(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postController.show,
);

postRouter.get(
  '/user/:userId',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postController.showPostsByUserId,
);

postRouter.delete(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postController.delete,
);

export { postRouter };
