
import { prisma } from "@arbiter/database";

export const createSubmission = async (submissionOBJ: any) => {
  return prisma.submission.create({
    data: submissionOBJ,
  });
};

export const updateSubmissionResult = async (
  submissionId: number,
  result: {
    verdict: any;
    executionTime?: number;
    memoryUsed?: number;
  }
) => {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      verdict: result.verdict,
      status: "COMPLETED",
      executionTime: result.executionTime ?? null,
      memoryUsed: result.memoryUsed ?? null,
    },
  });
};

export const updateSubmissionStatus = async (
  submissionId: number,
  status: "PROCESSING" | "FAILED"
) => {
  return prisma.submission.update({
    where: { id: submissionId },
    data: { status },
  });
};

export const getProblemTestCases = async (problemId: number) => {
  return prisma.testCases.findMany({
    where: { problemId },
    orderBy: { id: "asc" },
  });
};

export const getSampleTestCases = async (problemId: number) => {
  return prisma.testCases.findMany({
    where: {
      problemId,
      isSample: true,
    },
    orderBy: { id: "asc" },
  });
};

export const getUserSubmissions = async (userId: number) => {
  return prisma.submission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getSubmissions = async (problemId: number) => {
  return prisma.submission.findMany({
    where: { problemId },
    orderBy: { createdAt: "desc" },
  });
};

export const getSubmissionById = async (submissionId: number) => {
  return prisma.submission.findUnique({
    where: { id: submissionId },
  });
};
