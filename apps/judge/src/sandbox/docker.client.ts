
import { spawn } from "node:child_process";

interface DockerResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}


export function writeToDocker(
  containerId: string,
  containerPath: string,
  content: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "docker",
      [
        "exec",
        "-i",
        containerId,
        "sh",
        "-c",
        'cat > "$1"',
        "sh",
        containerPath,
      ],
      { stdio: ["pipe", "ignore", "pipe"] }
    );

    let stderr = "";

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`File transfer failed: ${stderr}`));
      } else {
        resolve();
      }
    });

    child.stdin.end(content);
  });
}

export function runDockerCommand(
  args: string[],
  timeoutMs = 15000,
  stdin = ""
): Promise<DockerResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const maxOutputBytes = 1024 * 1024;

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      finish(new Error("Docker command timed out"));
    }, timeoutMs);

    function finish(error?: Error, exitCode?: number) {
      if (settled) return;

      settled = true;
      clearTimeout(timeout);

      if (error) {
        reject(error);
      } else {
        resolve({
          stdout,
          stderr,
          exitCode: exitCode ?? 1,
        });
      }
    }

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();

      if (Buffer.byteLength(stdout) > maxOutputBytes) {
        child.kill("SIGKILL");
        finish(new Error("Docker stdout exceeded output limit"));
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();

      if (Buffer.byteLength(stderr) > maxOutputBytes) {
        child.kill("SIGKILL");
        finish(new Error("Docker stderr exceeded output limit"));
      }
    });

    child.on("error", (error) => {
      finish(error);
    });

    child.on("close", (code) => {
      finish(undefined, code ?? 1);
    });

    child.stdin.end(stdin);
  });
}
