import type { Request, Response, NextFunction } from 'express';
import { createSubmissionService, getUserSubmissionsService, getSubmissionsService } from './submission.service';

export const createSubmissionController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const submissionOBJ = req.body;

        const submisison = await createSubmissionService(submissionOBJ);
        res.status(201).json({
            success: true,
            message: 'Submission created successfully',
            data: submisison
        })
    } catch (error) {
        next(error);
    }
}

export const getUserSubmissionsController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const userId = req.user?.id;
        const submissions = await getUserSubmissionsService(userId);
        res.status(200).json({
            success: true,
            message: 'User submissions retrieved successfully',
            data: submissions
        })
    } catch (error) { 
        next(error);
    }
}

export const getSubmissionsController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const problemId = parseInt(req.params.problemId as string);
        const submissions = await getSubmissionsService(problemId);
        res.status(200).json({
            success: true,
            message: 'Submissions retrieved successfully',
            data: submissions
        })
    }catch (error) {
        next(error);
    }
}

