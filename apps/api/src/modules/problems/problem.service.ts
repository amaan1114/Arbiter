import httpError from '../../utils/httpError'
import { createProblem, deleteProblem, getProblemById, getProblems, updateProblem } from './problem.repo'


export const getProblemsService = async()=>{
    return await getProblems()
}

export const getProblemByIdService = async(problemId: number)=>{
    if(!problemId) throw new httpError(400, 'Problem ID is required')
    return await getProblemById(problemId)
}

export const createProblemService = async(problem: any)=>{
    if(!problem) throw new httpError(400, 'Problem data is required')
    return await createProblem(problem)
}

export const updateProblemService = async(problem: any)=>{
    if(!problem) throw new httpError(400, 'Problem data is required')
    return await updateProblem(problem)
}

export const deleteProblemService = async(problemId: number)=>{
    if(!problemId) throw new httpError(400, 'Problem ID is required')
    return await deleteProblem(problemId)
}   