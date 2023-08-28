import { Router } from 'express';
import { container } from 'tsyringe';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticate';
import { EnsureEmailConfirmationMiddleware } from '@shared/middlewares/EnsureEmailConfirmationMiddleware';
import { CommentsEvaluationsController } from '@controllers/CommentsEvaluationsController';

const commentsEvaluationsRouter = Router();
const commentsEvaluationsController = new CommentsEvaluationsController();
const ensureEmailConfirmation = container.resolve(
  EnsureEmailConfirmationMiddleware,
);

commentsEvaluationsRouter.post(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsEvaluationsController.create,
);

commentsEvaluationsRouter.get(
  '/',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsEvaluationsController.show,
);

commentsEvaluationsRouter.get(
  '/comment/:commentId',
  ensureAuthenticated,
  ensureEmailConfirmation.execute,
  commentsEvaluationsController.showByComment,
);

export { commentsEvaluationsRouter };
