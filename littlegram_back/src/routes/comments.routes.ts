import { container } from 'tsyringe';
import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticate';
import { EnsureEmailConfirmationMiddleware } from '@shared/middlewares/EnsureEmailConfirmationMiddleware';
import { CommentsController } from '@controllers/CommentsController';

const commentsRouter = Router();
const commentsController = new CommentsController();
const ensureEmailConfirmation = container.resolve(
  EnsureEmailConfirmationMiddleware,
);

commentsRouter.post(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsController.create,
);

commentsRouter.get(
  '/post/:postId',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsController.show,
);

commentsRouter.delete(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsController.delete,
);

commentsRouter.delete(
  '/post',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsController.deleteByPost,
);

export { commentsRouter };
