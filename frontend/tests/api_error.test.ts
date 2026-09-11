import assert from "node:assert";
import { formatApiError } from "../lib/error.ts";

// 1. Test FastAPI 422 validation error array
const validation422 = {
  detail: [
    {
      type: "string_too_short",
      loc: ["body", "raw_text"],
      msg: "String should have at least 5 characters",
      input: "leak",
      ctx: { min_length: 5 },
    },
  ],
};

const result1 = formatApiError(validation422, 422);
console.log("Test 1 Result:", result1);
assert.strictEqual(result1, "raw_text: String should have at least 5 characters");
assert.ok(!result1.includes("[object Object]"), "Should never contain [object Object]");

// 2. Test multiple field validation errors
const multiple422 = {
  detail: [
    { loc: ["body", "raw_text"], msg: "String should have at least 5 characters" },
    { loc: ["body", "latitude"], msg: "Input should be a valid number" },
  ],
};

const result2 = formatApiError(multiple422, 422);
console.log("Test 2 Result:", result2);
assert.strictEqual(
  result2,
  "raw_text: String should have at least 5 characters; latitude: Input should be a valid number"
);
assert.ok(!result2.includes("[object Object]"), "Should never contain [object Object]");

// 3. Test string detail (e.g., 404 Not Found or 500 error)
const stringError = {
  detail: "Complaint with ID JS-2026-PUN-99999 not found",
};

const result3 = formatApiError(stringError, 404);
console.log("Test 3 Result:", result3);
assert.strictEqual(result3, "Complaint with ID JS-2026-PUN-99999 not found");

// 4. Test empty or unexpected payload fallback
const emptyError = {};
const result4 = formatApiError(emptyError, 500);
console.log("Test 4 Result:", result4);
assert.strictEqual(result4, "API request failed with status 500");

console.log("All frontend API error formatting tests passed successfully!");
