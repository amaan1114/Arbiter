import type { Request, Response, NextFunction } from 'express';
import { getProblemById } from './problem.repo';
import HttpError from '../../utils/httpError';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const problemId = Number(req.params.id);
    const userId = req.user?.id;

    if (!Number.isInteger(problemId)) {
        return next(new HttpError(400, 'Invalid problem ID'));
    }

    if (!userId) {
        return next(new HttpError(401, 'User authentication is required'));
    }

    try {
        const problem = await getProblemById(problemId);

        if (!problem) {
            return next(new HttpError(404, 'Problem not found'));
        }

        if (problem.adminId !== userId) {
            return next(new HttpError(403, 'Only the problem admin can delete it'));
        }

        next();
    } catch (error) {
        next(error);
    }
}