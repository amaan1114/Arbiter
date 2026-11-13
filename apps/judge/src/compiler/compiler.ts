
import { resolveLanguage } from "../language/language.utils.js";
import {
  executeInSandbox,
} from "../sandbox/sandbox.manager.js";

export interface Sandbox {
  containerId: string;
}

export interface CompilationResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function compileCode(
  language: string,
  sandbox: Sandbox
): Promise<CompilationResult> {
  const config = resolveLanguage(language);

  // Python and JavaScript don't require compilation.
  if (!config.compileCommand) {
    return {
      success: true,
      stdout: "",
      stderr: "",
      exitCode: 0,
    };
  }

  const result = await executeInSandbox(
    sandbox,
    config.compileCommand
  );

  return {
    success: result.exitCode === 0,
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}
