import express from 'express';
import { createSubmissionController, getUserSubmissionsController, getSubmissionsController } from './submission.controller';
import { authMiddleware } from '../auth/auth.middleware';

const submissionRouter = express.Router();
submissionRouter.post('/', authMiddleware, createSubmissionController);
submissionRouter.get('/me', authMiddleware, getUserSubmissionsController);
submissionRouter.get('/:problemId', authMiddleware, getSubmissionsController);

export default submissionRouter;

