
import type { TestCaseResult } from "../testcase/testcase.runner.js";

export type Verdict = "AC" | "WA" | "RE" | "TLE";

export interface EvaluatedTestCase extends TestCaseResult {
  verdict: Verdict;
}

export interface EvaluationResult {
  verdict: Verdict;
  passed: number;
  failed: number;
  total: number;
  testCases: EvaluatedTestCase[];
}

// Basic output normalization for our MVP.
// Ignore leading/trailing whitespace and normalize line endings.
function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, "\n")
    .trim();
}

function evaluateTestCase(
  testCase: TestCaseResult
): EvaluatedTestCase {
  const { execution, expectedOutput } = testCase;

  // Check timeout before checking the exit code.
  if (execution.timedOut) {
    return { ...testCase, verdict: "TLE" };
  }

  // A non-zero exit code indicates runtime failure.
  if (execution.exitCode !== 0) {
    return { ...testCase, verdict: "RE" };
  }

  const actual = normalizeOutput(execution.stdout);
  const expected = normalizeOutput(expectedOutput as string);


  if (actual !== expected) {
    return { ...testCase, verdict: "WA" };
  }

  return { ...testCase, verdict: "AC" };
}

export function evaluateTestCases(
  testCases: TestCaseResult[]
): EvaluationResult {
  if (testCases.length === 0) {
    throw new Error("Cannot evaluate an empty test case list");
  }

  const evaluated = testCases.map(evaluateTestCase);

  const passed = evaluated.filter(
    (testCase) => testCase.verdict === "AC"
  ).length;

  const failed = evaluated.length - passed;

  // The first failing testcase determines the overall verdict.
  const firstFailure = evaluated.find(
    (testCase) => testCase.verdict !== "AC"
  );

  return {
    verdict: firstFailure?.verdict ?? "AC",
    passed,
    failed,
    total: evaluated.length,
    testCases: evaluated,
  };
}
