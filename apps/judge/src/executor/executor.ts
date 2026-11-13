
import { performance } from "node:perf_hooks";
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
  executionTime: number;
  memoryUsed: number | null;
}

const METRICS_MARKER = "__ARBITER_METRICS__";

export async function executeCode(
  language: string,
  sandbox: Sandbox,
  input: string
): Promise<ExecutionResult> {
  const config = resolveLanguage(language);

  const startTime = performance.now();

  const command = [
    "timeout",
    "--signal=TERM",
    "--kill-after=1s",
    `${sandboxConfig.commandTimeoutMs / 1000}s`,

    "/usr/bin/time",
    "-f",
    `${METRICS_MARKER}%e %M`,

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

  const elapsedTime = performance.now() - startTime;

  // Extract metrics from GNU time's stderr output.
  const metricsRegex = new RegExp(
    `${METRICS_MARKER}(\\d+(?:\\.\\d+)?)\\s+(\\d+)`
  );

  const metricsMatch = result.stderr.match(metricsRegex);

  const executionTime = metricsMatch
    ? Math.round(Number(metricsMatch[1]) * 1000)
    : Math.round(elapsedTime);

  const memoryUsed = metricsMatch
    ? Number(metricsMatch[2])
    : null;

  // Remove internal metrics from user-visible stderr.
  const stderr = result.stderr
    .replace(metricsRegex, "")
    .trim();

  return {
    stdout: result.stdout,
    stderr,
    exitCode: result.exitCode,
    timedOut: result.exitCode === 124,
    executionTime,
    memoryUsed,
  };
}
