import { Router } from 'express';
import { container } from 'tsyringe';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticate';
import { EnsureEmailConfirmationMiddleware } from '@shared/middlewares/EnsureEmailConfirmationMiddleware';
import { PostsEvaluationsController } from '@controllers/PostsEvaluationsController';

const postsEvaluationsRouter = Router();
const postsEvaluationsController = new PostsEvaluationsController();
const ensureEmailConfirmation = container.resolve(
  EnsureEmailConfirmationMiddleware,
);

postsEvaluationsRouter.post(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postsEvaluationsController.create,
);

postsEvaluationsRouter.get(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postsEvaluationsController.show,
);

postsEvaluationsRouter.get(
  '/post/:postId',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  postsEvaluationsController.showByPost,
);

export { postsEvaluationsRouter };
