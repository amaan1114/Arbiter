import express from 'express';
import { createSubmissionController, getUserSubmissionsController, getSubmissionsController, getSubmissionByIdController, runSubmissionController} from './submission.controller';
import { authMiddleware } from '../auth/auth.middleware';

const submissionRouter = express.Router();
submissionRouter.post('/', authMiddleware, createSubmissionController);
submissionRouter.post('/run',authMiddleware, runSubmissionController );
submissionRouter.get('/me', authMiddleware, getUserSubmissionsController);
submissionRouter.get('/:problemId', authMiddleware, getSubmissionsController);
submissionRouter.get('/:id', authMiddleware, getSubmissionByIdController);
export default submissionRouter;

