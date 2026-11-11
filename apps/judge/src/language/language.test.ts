
import test from "node:test";
import assert from "node:assert/strict";

import {
  isSupportedLanguage,
  resolveLanguage,
} from "./language.utils";

test("should recognize all supported languages", () => {
  assert.equal(isSupportedLanguage("PYTHON"), true);
  assert.equal(isSupportedLanguage("JAVASCRIPT"), true);
  assert.equal(isSupportedLanguage("CPP"), true);
});

test("should reject unsupported languages", () => {
  assert.equal(isSupportedLanguage("RUST"), false);
});

test("should resolve Python configuration", () => {
  const config = resolveLanguage("PYTHON");

  assert.equal(config.sourceFile, "main.py");
  assert.equal(config.compileCommand, null);
});

test("should resolve C++ configuration", () => {
  const config = resolveLanguage("CPP");

  assert.equal(config.sourceFile, "main.cpp");
  assert.equal(config.compileCommand[0], "g++");
});


test("should throw for unsupported languages", () => {
  assert.throws(() => resolveLanguage("RUST"));
});
