import express from 'express';
import { getProblemsController, getProblemByIdController, problemCreationController, problemUpdateController, problemDeletionController } from './problem.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { isAdmin } from './problem.middleware';

const problemRouter = express.Router();

problemRouter.get('/', getProblemsController);
problemRouter.get('/:id', getProblemByIdController);
problemRouter.post('/',authMiddleware,problemCreationController);
problemRouter.put('/',authMiddleware,problemUpdateController);
problemRouter.delete('/:id', authMiddleware, isAdmin, problemDeletionController);

export default problemRouter;
