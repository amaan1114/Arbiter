
import { evaluateTestCases } from "./evaluator.js";
import type { TestCaseResult } from "../testcase/testcase.runner.js";

const testCases: TestCaseResult[] = [
  {
    testCaseId: "TC1",
    input: "2 3\n",
    expectedOutput: "5\n",
    execution: {
      stdout: "5\n",
      stderr: "",
      exitCode: 0,
      timedOut: false,
    },
  },
  {
    testCaseId: "TC2",
    input: "10 20\n",
    expectedOutput: "30\n",
    execution: {
      stdout: "30\n",
      stderr: "",
      exitCode: 0,
      timedOut: false,
    },
  },
  {
    testCaseId: "TC3",
    input: "-5 5\n",
    expectedOutput: "0\n",
    execution: {
      stdout: "10\n",
      stderr: "",
      exitCode: 0,
      timedOut: false,
    },
  },
];

const result = evaluateTestCases(testCases);

console.log("Evaluation result:", result);
