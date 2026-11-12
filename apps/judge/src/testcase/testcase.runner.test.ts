
import {
  createSandbox,
  copyFileToSandbox,
  destroySandbox,
} from "../sandbox/sandbox.manager.js";

import { runTestCases } from "./testcase.runner.js";

const testCases = [
  {
    id: "TC1",
    input: "2 3\n",
    expectedOutput: "5\n",
  },
  {
    id: "TC2",
    input: "10 20\n",
    expectedOutput: "30\n",
  },
  {
    id: "TC3",
    input: "-5 5\n",
    expectedOutput: "0\n",
  },
];

const sandbox = await createSandbox("python:3.12-slim");

try {
  await copyFileToSandbox(
    sandbox,
    "src/testcase/test-code/main.py",
    "/workspace/main.py"
  );

  const results = await runTestCases(
    "PYTHON",
    sandbox,
    testCases
  );

  console.log("Testcase results:", results);
} finally {
  await destroySandbox(sandbox);
}
