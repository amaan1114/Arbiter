
import { resolveLanguage } from "../language/language.utils.js";
import { runDockerCommand } from "../sandbox/docker.client.js";
import { sandboxConfig } from "../sandbox/sandbox.config.js";

interface Sandbox {
  containerId: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

export async function executeCode(
  language: string,
  sandbox: Sandbox,
  input: string
): Promise<ExecutionResult> {
  const config = resolveLanguage(language);

  // Run with an in-container timeout so the submitted
  // process is terminated, not just the Docker CLI.
  const command = [
    "timeout",
    "--signal=TERM",
    "--kill-after=1s",
    `${sandboxConfig.commandTimeoutMs/1000}s`,
    ...config.executionCommand,
  ];

  const result = await runDockerCommand(
    [
      "exec",
      "-i",
      "--user", sandboxConfig.user,
      "--workdir", sandboxConfig.workingDirectory,
      sandbox.containerId,
      ...command,
    ],
    sandboxConfig.commandTimeoutMs + 3000,
    input
  );

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
    timedOut: result.exitCode === 124,
  };
}
