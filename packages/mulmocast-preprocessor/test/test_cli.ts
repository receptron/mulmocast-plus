import { describe, it } from "node:test";
import assert from "node:assert";
import { execSync } from "child_process";
import { readFileSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, "../lib/cli/index.js");
const FIXTURE_PATH = join(__dirname, "fixtures/sample.json");

const runCli = (args: string): string => {
  return execSync(`node ${CLI_PATH} ${args}`, { encoding: "utf-8" });
};

describe("CLI", () => {
  describe("help", () => {
    it("should show help with --help", () => {
      const output = runCli("--help");
      assert.ok(output.includes("Process MulmoScript with profile"));
      assert.ok(output.includes("--profile"));
      assert.ok(output.includes("--output"));
    });
  });

  describe("version", () => {
    it("should show version with --version", () => {
      const output = runCli("--version");
      assert.match(output.trim(), /^\d+\.\d+\.\d+$/);
    });
  });

  describe("profiles command", () => {
    it("should list available profiles", () => {
      const output = runCli(`profiles ${FIXTURE_PATH}`);
      assert.ok(output.includes("Available profiles:"));
      assert.ok(output.includes("default"));
      assert.ok(output.includes("summary"));
      assert.ok(output.includes("teaser"));
      assert.ok(output.includes("4 beats"));
      assert.ok(output.includes("2 skipped"));
    });
  });

  describe("process command", () => {
    it("should process with default profile", () => {
      const output = runCli(FIXTURE_PATH);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 4);
      assert.equal(result.beats[0].text, "Welcome to this detailed presentation about our topic.");
    });

    it("should process with summary profile", () => {
      const output = runCli(`${FIXTURE_PATH} --profile summary`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 4);
      assert.equal(result.beats[0].text, "Welcome to the summary.");
      assert.equal(result.beats[1].text, "Brief background info.");
    });

    it("should process with teaser profile (skip beats)", () => {
      const output = runCli(`${FIXTURE_PATH} --profile teaser`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 2);
      assert.equal(result.beats[0].text, "Check this out!");
      assert.equal(result.beats[1].text, "Try it now!");
    });

    it("should output to file with -o option", () => {
      const outputPath = join(__dirname, "fixtures/output_test.json");

      try {
        runCli(`${FIXTURE_PATH} --profile summary -o ${outputPath}`);
        assert.ok(existsSync(outputPath));

        const content = readFileSync(outputPath, "utf-8");
        const result = JSON.parse(content);
        assert.equal(result.beats.length, 4);
        assert.equal(result.beats[0].text, "Welcome to the summary.");
      } finally {
        if (existsSync(outputPath)) {
          unlinkSync(outputPath);
        }
      }
    });

    it("should strip variants and meta from output", () => {
      const output = runCli(`${FIXTURE_PATH} --profile summary`);
      const result = JSON.parse(output);

      result.beats.forEach((beat: Record<string, unknown>) => {
        assert.ok(!("variants" in beat), "variants should be stripped");
        assert.ok(!("meta" in beat), "meta should be stripped");
      });

      assert.ok(!("outputProfiles" in result), "outputProfiles should be stripped");
    });

    it("should filter by section", () => {
      const output = runCli(`${FIXTURE_PATH} --section chapter1`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 2);
    });

    it("should filter by tags", () => {
      const output = runCli(`${FIXTURE_PATH} --tags intro,conclusion`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 2);
    });

    it("should combine profile and section filter", () => {
      const output = runCli(`${FIXTURE_PATH} --profile summary --section chapter1`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 2);
      assert.equal(result.beats[0].text, "Brief background info.");
    });

    it("should combine profile and tags filter", () => {
      const output = runCli(`${FIXTURE_PATH} --profile summary --tags intro`);
      const result = JSON.parse(output);
      assert.equal(result.beats.length, 1);
      assert.equal(result.beats[0].text, "Welcome to the summary.");
    });
  });
});
