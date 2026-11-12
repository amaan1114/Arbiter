
import {
  createSandbox,
  copyFileToSandbox,
  destroySandbox,
} from "../sandbox/sandbox.manager.js";

import { compileCode } from "./compiler.js";

async function testCompilation(
  language: string,
  image: string,
  sourcePath: string,
  containerPath: string
) {
  const sandbox = await createSandbox(image);

  try {
    await copyFileToSandbox(
      sandbox,
      sourcePath,
      containerPath
    );

    const result = await compileCode(language, sandbox);

    console.log(`\n${language} compilation result:`);
    console.log(result);
  } finally {
    await destroySandbox(sandbox);
  }
}

await testCompilation(
  "CPP",
  "gcc:14",
  "src/compiler/test-code/main.cpp",
  "/workspace/main.cpp"
);


await testCompilation(
  "PYTHON",
  "python:3.12-slim",
  "src/compiler/test-code/main.py",
  "/workspace/main.py"
);

await testCompilation(
  "JAVASCRIPT",
  "node:22-bookworm-slim",
  "src/compiler/test-code/main.js",
  "/workspace/main.js"
);
