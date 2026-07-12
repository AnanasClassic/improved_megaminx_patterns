import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { Alg } from "cubing/alg";
import { puzzles } from "cubing/puzzles";

const patterns = JSON.parse(
  await readFile(new URL("../public/patterns.json", import.meta.url), "utf8")
);

test("contains 334 uniquely-addressable patterns", () => {
  assert.equal(patterns.length, 334);
  assert.equal(new Set(patterns.map(({ code }) => code)).size, patterns.length);
  assert.ok(patterns.every(({ code }) => /^[A-Z]\d{3}\.\d{2}$/.test(code)));
});

test("contains all three comparison states", () => {
  const states = new Set(
    patterns.map((pattern) => Math.sign(pattern.new_solution_length - pattern.old_solution_length))
  );
  assert.deepEqual([...states].sort(), [-1, 0, 1]);
});

test("all displayed Alpha Twizzle links are complete", () => {
  for (const pattern of patterns) {
    for (const field of [
      "old_alpha_twizzle_link",
      "alpha_twizzle_link",
      "minimal_ftm_alpha_twizzle_link"
    ]) {
      const link = new URL(pattern[field]);
      assert.equal(link.origin, "https://alpha.twizzle.net", `${pattern.code}: ${field}`);
      assert.equal(link.searchParams.get("puzzle"), "megaminx", `${pattern.code}: ${field}`);
      assert.ok(link.searchParams.get("alg"), `${pattern.code}: ${field}`);
      if (field === "old_alpha_twizzle_link") {
        assert.equal(link.searchParams.get("setup-anchor"), "start", `${pattern.code}: ${field}`);
      }
    }
  }
});

test("all preview and editor algorithms are valid for Megaminx", async () => {
  const kpuzzle = await puzzles.megaminx.kpuzzle();

  for (const pattern of patterns) {
    for (const field of [
      "old_twizzle_solution",
      "new_solution",
      "minimal_ftm_solution"
    ]) {
      assert.doesNotThrow(
        () => kpuzzle.algToTransformation(new Alg(pattern[field])),
        `${pattern.code}: ${field}`
      );
    }
  }
});
