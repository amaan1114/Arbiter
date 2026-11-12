
import {
  createSandbox,
  copyFileToSandbox,
  destroySandbox,
} from "../sandbox/sandbox.manager.js";

import { executeCode } from "./executor.js";

const sandbox = await createSandbox("python:3.12-slim");

try {
  await copyFileToSandbox(
    sandbox,
    "src/executor/test-code/main.py",
    "/workspace/main.py"
  );

  const result = await executeCode(
    "PYTHON",
    sandbox,
    `3 3
    1 2 3
    4 5 6
    7 8 9`
  );

  console.log("Execution result:", result);
} finally {
  await destroySandbox(sandbox);
}
