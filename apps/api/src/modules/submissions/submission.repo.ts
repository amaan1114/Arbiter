import { prisma } from '@arbiter/database'
export const createSubmission = async (submissionOBJ: any) => {
    await prisma.submission.create({
        data: submissionOBJ
    })
}

export const getUserSubmissions = async (userId: number) => {
    return prisma.submission.findMany({
        where: { userId: userId }
    })
}

export const getSubmissions = async (problemId: number) => {
    return prisma.submission.findMany({
        where: { problemId: problemId }
    })
}