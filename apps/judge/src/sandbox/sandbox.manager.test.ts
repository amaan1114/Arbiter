import {
  createSandbox,
  executeInSandbox,
  destroySandbox,
} from "./sandbox.manager.js";

const sandbox = await createSandbox("python:3.12-slim");

try {
  const result = await executeInSandbox(
    sandbox,
    ["python3", "-c", "print(10 + 20)"]
  );

  console.log(result);
} finally {
  await destroySandbox(sandbox);
}
