
import { resolveLanguage } from "./language/language.utils.js";

import {
  createSandbox,
  writeCodeToSandbox,
  destroySandbox,
} from "./sandbox/sandbox.manager.js";

import { compileCode } from "./compiler/compiler.js";
import { runTestCases } from "./testcase/testcase.runner.js";
import { evaluateTestCases } from "./evaluator/evaluator.js";

// Common request structure.
interface CodeExecutionRequest {
  sourceCode: string;
  language: string;
}

// Run request: only needs input.
interface RunRequest extends CodeExecutionRequest {
  testCases: {
    id: string;
    input: string;
  }[];
}

// Judge request: additionally needs expected output.
interface JudgeRequest extends CodeExecutionRequest {
  submissionId: string;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
  }[];
}

export async function judgeSubmission(request: JudgeRequest) {
  const language = resolveLanguage(request.language);
  const sandbox = await createSandbox(language.image);

  try {
    // 1. Write source code into sandbox.
    await writeCodeToSandbox(
      sandbox,
      request.sourceCode,
      language.sourceFile
    );

    // 2. Compile if required.
    const compilation = await compileCode(request.language, sandbox);

    // 3. Handle compilation failure.
    if (!compilation.success) {
      return {
        submissionId: request.submissionId,
        verdict: "CE" as const,
        compilation,
        passed: 0,
        failed: 0,
        total: request.testCases.length,
        executionTime: 0,
        memoryUsed: null,
        testCases: [],
      };
    }

    // 4. Execute test cases.
    const testResults = await runTestCases(
      request.language,
      sandbox,
      request.testCases
    );

    // 5. Evaluate results.
    const evaluation = evaluateTestCases(testResults);

    // 6. Calculate execution metrics.
    const executionTime = testResults.reduce(
      (total, testCase) =>
        total + testCase.execution.executionTime,
      0
    );

    const memoryValues = testResults
      .map((testCase) => testCase.execution.memoryUsed)
      .filter((value): value is number => value !== null);

    const memoryUsed = memoryValues.length > 0
      ? Math.max(...memoryValues)
      : null;

    // 7. Return final result.
    return {
      submissionId: request.submissionId,
      verdict: evaluation.verdict,
      passed: evaluation.passed,
      failed: evaluation.failed,
      total: evaluation.total,
      executionTime,
      memoryUsed,
      testCases: evaluation.testCases,
    };
  } finally {
    // 8. Always destroy sandbox.
    await destroySandbox(sandbox);
  }
}

export async function runCode(request: RunRequest) {
  const language = resolveLanguage(request.language);
  const sandbox = await createSandbox(language.image);

  try {
    // 1. Write source code.
    await writeCodeToSandbox(
      sandbox,
      request.sourceCode,
      language.sourceFile
    );

    // 2. Compile if required.
    const compilation = await compileCode(request.language, sandbox);

    // 3. Handle compilation failure.
    if (!compilation.success) {
      return {
        verdict: "CE" as const,
        compilation,
        testCases: [],
        executionTime: 0,
        memoryUsed: null,
      };
    }

    // 4. Execute test cases.
    const testResults = await runTestCases(
      request.language,
      sandbox,
      request.testCases
    );

    // 5. Aggregate execution metrics.
    const executionTime = testResults.reduce(
      (total, testCase) =>
        total + testCase.execution.executionTime,
      0
    );

    const memoryValues = testResults
      .map((testCase) => testCase.execution.memoryUsed)
      .filter((value): value is number => value !== null);

    const memoryUsed = memoryValues.length > 0
      ? Math.max(...memoryValues)
      : null;

    return {
      compilation,
      testCases: testResults,
      executionTime,
      memoryUsed,
    };
  } finally {
    // 6. Always destroy sandbox.
    await destroySandbox(sandbox);
  }
}
