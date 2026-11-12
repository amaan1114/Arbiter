import { resolveLanguage } from "./language/language.utils.js";
import { createSandbox, copyFileToSandbox, destroySandbox } from "./sandbox/sandbox.manager.js";
import { compileCode } from "./compiler/compiler.js";
import { runTestCases } from "./testcase/testcase.runner.js";
import { evaluateTestCases } from "./evaluator/evaluator.js";

interface JudgeRequest {
  submissionId: string;
  sourceCode: string;
  language: string;
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
    // 1. Write submitted source code into sandbox
    // 2. Compile if required
    // 3. Handle compilation error
    // 4. Run testcases
    // 5. Evaluate results
    // 6. Return final result
  } finally {
    await destroySandbox(sandbox);
  }
}