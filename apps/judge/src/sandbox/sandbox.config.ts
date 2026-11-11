export const sandboxConfig = {
  // Resource limits
  memory: "128m",
  memorySwap: "128m",
  cpus: "1",
  pidsLimit: 32,

  // User inside the container (non-root)
  user: "65534:65534",

  // Container filesystem
  readOnly: true,
  workingDirectory: "/workspace",

  // Temporary writable directories
  workspaceTmpfs:
    "/workspace:rw,exec,nosuid,nodev,size=64m,uid=65534,gid=65534",

  tmpTmpfs:
    "/tmp:rw,noexec,nosuid,nodev,size=16m,uid=65534,gid=65534",

  // Security restrictions
  network: "none",
  dropCapabilities: "ALL",
  noNewPrivileges: true,

  // Lifecycle
  autoRemove: false,
  init: true,

  // Execution limits
  commandTimeoutMs: 5000,
  maxOutputBytes: 1024 * 1024,
};
