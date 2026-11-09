import {prisma} from '@arbiter/database'
export const getProblems = async()=>{
    return prisma.problems.findMany()
}

export const getProblemById = async(problemId:number)=>{
    return prisma.problems.findUnique({
        where:{id:problemId}
    })
}

export const createProblem = async(problem:any)=>{

    return prisma.problems.create({
        data:problem
    })
}

export const updateProblem = async(problem:any)=>{
    const updateProblemData = {
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        status: problem.status
    }

    return prisma.problems.update({
        where:{id:problem.id},
        data:updateProblemData
    })
}

export const deleteProblem = async(problemId:number)=>{
    return prisma.problems.delete({
        where:{id:problemId}
    })
}   