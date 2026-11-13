
import { executeCode } from "../executor/executor.js";

interface Sandbox {
  containerId: string;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput?: string;
}

type ExecutionResult = Awaited<ReturnType<typeof executeCode>>;

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput?: string;
  execution: ExecutionResult;
}

export async function runTestCases(
  language: string,
  sandbox: Sandbox,
  testCases: TestCase[]
): Promise<TestCaseResult[]> {
  const results: TestCaseResult[] = [];

  // Execute sequentially inside the same submission sandbox.
  for (const testCase of testCases) {
    const execution = await executeCode(
      language,
      sandbox,
      testCase.input
    );

    results.push({
      testCaseId: testCase.id,
      input: testCase.input,
      ...(testCase.expectedOutput !== undefined && {
        expectedOutput: testCase.expectedOutput,
      }),
      execution,
    });
  }

  return results;
}
