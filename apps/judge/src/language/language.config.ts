
export const languageConfig = {
  PYTHON: {
    image: "python:3.12-slim",
    extension: "py",
    sourceFile: "main.py",

    compileCommand: null,
    executionCommand: ["python3", "main.py"],
  },

  JAVASCRIPT: {
    image: "node:22-bookworm-slim",
    extension: "js",
    sourceFile: "main.js",

    compileCommand: null,
    executionCommand: ["node", "main.js"],
  },

  CPP: {
    image: "gcc:14",
    extension: "cpp",
    sourceFile: "main.cpp",

    compileCommand: [
      "g++",
      "-std=c++20",
      "-O2",
      "-pipe",
      "main.cpp",
      "-o",
      "main",
    ],
    executionCommand: ["./main"],
  },

 
};
