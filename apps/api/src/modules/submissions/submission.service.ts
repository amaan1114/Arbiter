import httpError from '../../utils/httpError'
import { createSubmission, getUserSubmissions, getSubmissions,getSubmissionById } from './submission.repo'
export const createSubmissionService = async (submissionOBJ: any) => {
    if (!submissionOBJ) {
        throw new httpError(400, 'Submission object is required');
    }
    const submission = await createSubmission(submissionOBJ);
    return submission;
}

export const getUserSubmissionsService = async (userId:number) => {
    if (!userId) {
        throw new httpError(400, 'User ID is required');
    }
    const submissions = await getUserSubmissions(userId);
    return submissions;
}

export const getSubmissionsService = async (problemId:number) => {
    if (!problemId) {
        throw new httpError(400, 'Problem ID is required');
    }
    const submissions = await getSubmissions(problemId);
    return submissions;
}   

export const getSubmissionByIdService = async (submissionId:number) => {
    if (!submissionId) {
        throw new httpError(400, 'Submission ID is required');
    }
    const submission = await getSubmissionById(submissionId);
    return submission;
}