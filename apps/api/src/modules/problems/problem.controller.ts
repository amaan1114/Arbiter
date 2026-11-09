import type { Request, Response, NextFunction } from 'express';
import { getProblemsService, getProblemByIdService, createProblemService, updateProblemService, deleteProblemService } from './problem.service';

export const getProblemsController = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const problems = await getProblemsService();
        res.status(200).json({
            message: 'Problems fetched successfully',
            data: problems
        })
    }catch(err){
        next(err)
    }
}

export const getProblemByIdController = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const problemId = req.params.id;
        const problem = await getProblemByIdService(parseInt(problemId as string));
        res.status(200).json({
            message: 'Problem fetched successfully',
            data: problem
        })
    }catch(err){
        next(err)
    }
}   

export const problemCreationController = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const problem = req.body;
        await createProblemService(problem);
        res.status(201).json({
            message: 'Problem created successfully',
            data: problem
        })
    }catch(err){
        next(err)
    }
}


export const problemUpdateController = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const problem = req.body;
        await updateProblemService(problem);
        res.status(200).json({
            message: 'Problem updated successfully',
            data: problem
        })
    }catch(err){
        next(err)
    }
}

export const problemDeletionController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const problemId = req.params.id;
        await deleteProblemService(parseInt(problemId as string));
        res.status(200).json({
            message: 'Problem deleted successfully',
            data: problemId
        })
    }catch(err){
        next(err)
    }
}


