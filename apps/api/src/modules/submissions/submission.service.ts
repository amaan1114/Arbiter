
import httpError from "../../utils/httpError.js";

import {
  createSubmission,
  getProblemTestCases,
  updateSubmissionResult,
  updateSubmissionStatus,
  getSampleTestCases,
  getUserSubmissions,
  getSubmissions,
  getSubmissionById,
} from "./submission.repo.js";

import { judgeSubmission ,runCode} from "@arbiter/judge";

export const createSubmissionService = async (submissionOBJ: any) => {
  if (!submissionOBJ) {
    throw new httpError(400, "Submission object is required");
  }

  const { userId, problemId, code, language } = submissionOBJ;

  if (!userId || !problemId || !code || !language) {
    throw new httpError(400, "Missing submission fields");
  }

  // 1. Create permanent submission.
  const submission = await createSubmission({
    userId,
    problemId,
    code,
    language,
    status: "PENDING",
  });

  try {
    // 2. Mark as processing.
    await updateSubmissionStatus(submission.id, "PROCESSING");

    // 3. Retrieve official test cases.
    const testCases = await getProblemTestCases(problemId);

    if (testCases.length === 0) {
      throw new Error("Problem has no test cases");
    }

    // 4. Call Judge Engine.
    const result = await judgeSubmission({
      submissionId: String(submission.id),
      sourceCode: code,
      language,
      testCases: testCases.map((testCase) => ({
        id: String(testCase.id),
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })),
    });

    // 5. Save final result.
    await updateSubmissionResult(submission.id, {
      verdict: result.verdict,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed ?? 0,
    });

    return {
      ...result,
      status: "COMPLETED",
    };
  } catch (error) {
    await updateSubmissionStatus(submission.id, "FAILED");
    throw error;
  }
};


export const runSubmissionService = async (submissionOBJ: any) => {
  if (!submissionOBJ) {
    throw new httpError(400, "Submission object is required");
  }

  const { problemId, code, language } = submissionOBJ;

  if (!problemId || !code || !language) {
    throw new httpError(400, "Missing submission fields");
  }

  // 1. Retrieve only public sample test cases.
  const testCases = await getSampleTestCases(problemId);

  if (testCases.length === 0) {
    throw new httpError(404, "No sample test cases found");
  }

  // 2. Execute code against sample test cases.
  const result = await runCode({
    sourceCode: code,
    language,
    testCases: testCases.map((testCase) => ({
      id: String(testCase.id),
      input: testCase.input,
    })),
  });

  // 3. Return execution results. No database submission is created.
  return {
    results: result.testCases,
    executionTime: result.executionTime,
    memoryUsed: result.memoryUsed ?? 0,
  };
};


export const getUserSubmissionsService = async (userId: number) => {
  if (!userId) {
    throw new httpError(400, "User ID is required");
  }

  return getUserSubmissions(userId);
};

export const getSubmissionsService = async (problemId: number) => {
  if (!problemId) {
    throw new httpError(400, "Problem ID is required");
  }

  return getSubmissions(problemId);
};

export const getSubmissionByIdService = async (submissionId: number) => {
  if (!submissionId) {
    throw new httpError(400, "Submission ID is required");
  }

  return getSubmissionById(submissionId);
};
