import assert from "node:assert/strict";
import test from "node:test";

import {
  comparisonFor,
  groupLabel,
  personalSolutionsMatch,
  searchPatterns,
  sectionFor,
  twizzleLink
} from "../src/catalog.js";

const pattern = {
  code: "A200.01",
  name: "5 Dots (+72°)",
  old_solution_length: 30,
  new_solution_length: 36,
  new_solution: "R  U'  F",
  minimal_ftm_solution: "R U' F"
};

test("maps code to section and group", () => {
  assert.equal(sectionFor(pattern).label, "Simple Patterns");
  assert.equal(groupLabel(pattern), "Dot");
});

test("compares the personal best with the previous best", () => {
  assert.deepEqual(comparisonFor(pattern), {
    state: "longer",
    difference: 6,
    label: "+6 longer"
  });
  assert.equal(comparisonFor({ ...pattern, new_solution_length: 30 }).label, "same length");
  assert.equal(comparisonFor({ ...pattern, new_solution_length: 24 }).label, "−6 shorter");
});

test("treats whitespace-only algorithm differences as the same solution", () => {
  assert.equal(personalSolutionsMatch(pattern), true);
  assert.equal(personalSolutionsMatch({ ...pattern, minimal_ftm_solution: "R U F" }), false);
});

test("searches by code and name using all query terms", () => {
  const patterns = [pattern, { ...pattern, code: "A850.01", name: "2 Stars" }];
  assert.deepEqual(searchPatterns(patterns, "a200 dots"), [pattern]);
  assert.equal(searchPatterns(patterns, "star").length, 1);
  assert.equal(searchPatterns(patterns, "").length, 0);
});

test("generates an Alpha Twizzle editor link", () => {
  const link = new URL(twizzleLink("R U'"));
  assert.equal(link.origin, "https://alpha.twizzle.net");
  assert.equal(link.searchParams.get("alg"), "R U'");
  assert.equal(link.searchParams.get("puzzle"), "megaminx");
});
