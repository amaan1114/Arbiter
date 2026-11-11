import {
  createSandbox,
  copyFileToSandbox,
  executeInSandbox,
  destroySandbox,
} from "./sandbox.manager.js";

const sandbox = await createSandbox("python:3.12-slim");

try {
  await copyFileToSandbox(
    sandbox,
    "src/sandbox/test-code/main.py",
    "/workspace/main.py"
  );

  const result = await executeInSandbox(
    sandbox,
    ["python3", "main.py"]
  );

  console.log(result);
} finally {
  await destroySandbox(sandbox);
}