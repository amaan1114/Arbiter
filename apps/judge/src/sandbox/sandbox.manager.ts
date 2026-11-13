
import { runDockerCommand, writeToDocker } from "./docker.client.js";
import { sandboxConfig } from "./sandbox.config.js";
import { readFile } from "node:fs/promises";
import { resolve, basename } from "node:path";

export interface Sandbox {
  containerId: string;
}

interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function createSandbox(image: string): Promise<Sandbox> {
  const result = await runDockerCommand([
    "create",

    "--network", sandboxConfig.network,
    "--memory", sandboxConfig.memory,
    "--memory-swap", sandboxConfig.memorySwap,
    "--cpus", sandboxConfig.cpus,
    "--pids-limit", String(sandboxConfig.pidsLimit),

    "--user", sandboxConfig.user,
    "--read-only",

    "--cap-drop", sandboxConfig.dropCapabilities,
    "--security-opt", "no-new-privileges",

    "--tmpfs", sandboxConfig.workspaceTmpfs,
    "--tmpfs", sandboxConfig.tmpTmpfs,

    "--workdir", sandboxConfig.workingDirectory,
    "--init",

    "--entrypoint", "sleep",
    image,
    "infinity",
  ]);

  if (result.exitCode !== 0) {
    throw new Error(`Failed to create sandbox: ${result.stderr}`);
  }

  const containerId = result.stdout.trim();

  if (!containerId) {
    throw new Error("Docker did not return a container ID");
  }

  const startResult = await runDockerCommand(["start", containerId]);

  if (startResult.exitCode !== 0) {
    await runDockerCommand(["rm", "-f", containerId]);
    throw new Error(`Failed to start sandbox: ${startResult.stderr}`);
  }

  return { containerId };
}

// Writes source code directly into the sandbox.
export async function writeCodeToSandbox(
  sandbox: Sandbox,
  sourceCode: string,
  filename: string
): Promise<void> {
  // Only accept a filename, not an arbitrary path.
  if (basename(filename) !== filename || !filename) {
    throw new Error("Invalid source filename");
  }

  const containerPath =
    `${sandboxConfig.workingDirectory}/${filename}`;

  await writeToDocker(
    sandbox.containerId,
    containerPath,
    sourceCode
  );
}

// Copies an existing host file into the sandbox.
export async function copyFileToSandbox(
  sandbox: Sandbox,
  hostPath: string,
  containerPath: string
): Promise<void> {
  const content = await readFile(resolve(hostPath), "utf8");

  await writeToDocker(
    sandbox.containerId,
    containerPath,
    content
  );
}

export async function executeInSandbox(
  sandbox: Sandbox,
  command: string[]
): Promise<CommandResult> {
  const result = await runDockerCommand(
    [
      "exec",
      "--user", sandboxConfig.user,
      "--workdir", sandboxConfig.workingDirectory,
      sandbox.containerId,
      ...command,
    ],
    sandboxConfig.commandTimeoutMs
  );

  return result;
}

export async function destroySandbox(
  sandbox: Sandbox
): Promise<void> {
  const result = await runDockerCommand([
    "rm",
    "-f",
    sandbox.containerId,
  ]);

  if (result.exitCode !== 0) {
    throw new Error(`Failed to destroy sandbox: ${result.stderr}`);
  }
}
