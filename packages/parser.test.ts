import { parseToDynamicParams as parse } from "./parser.ts";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import type { DynamicParam } from "./type/index.ts";

Deno.test("parser", async (context) => {
  await context.step("parseToDynamicParams", () => {
    assertEquals<DynamicParam[]>(parse("/"), []);
    assertEquals<DynamicParam[]>(parse("/[uid]"), [
      { type: "single", name: "uid" },
    ]);
    assertEquals<DynamicParam[]>(parse("/[...slug]"), [
      { type: "rest", name: "slug", isOptional: false },
    ]);
    assertEquals<DynamicParam[]>(parse("/page/[[...params]]"), [
      { type: "rest", name: "params", isOptional: true },
    ]);
    assertEquals<DynamicParam[]>(parse("/[id]/[...slug]"), [
      { type: "single", name: "id" },
      { type: "rest", name: "slug", isOptional: false },
    ]);
  });
});
