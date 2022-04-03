import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import type { TestCase } from "./_helper/testcase.ts";
import { convertToRoute, convertToTemplate, pickQueries } from "./converter.ts";

Deno.test("convertToRoute", () => {
  const testCases: TestCase<typeof convertToRoute>[] = [
    [
      "pages",
      {
        path: "pages/index.ts",
        name: "index.ts",
        isDirectory: false,
        isFile: true,
        isSymlink: false,
      },
      { identity: "/", template: "/", query: [] },
    ],
    [
      "pages",
      {
        path: "pages/fuga.ts",
        name: "fuga.ts",
        isDirectory: false,
        isFile: true,
        isSymlink: false,
      },
      {
        identity: "/fuga/",
        template: "/fuga/",
        query: [],
      },
    ],
    [
      "pages",
      {
        path: "pages/fuga/index.ts",
        name: "index.ts",
        isDirectory: false,
        isFile: true,
        isSymlink: false,
      },
      {
        identity: "/fuga/",
        template: "/fuga/",
        query: [],
      },
    ],
  ];
  testCases.forEach((testcase) => {
    assertEquals(convertToRoute(testcase[0], testcase[1]), testcase[2]);
  });
});

Deno.test("convertToTemplate", () => {
  const testCases: TestCase<typeof convertToTemplate>[] = [
    ["/", "/"],
    ["/hoge/[id]", "/hoge/${id}"],
    ["/hoge/[id]/[id]", "/hoge/${id}/${id}"],
  ];
  testCases.forEach((testcase) => {
    assertEquals<string>(convertToTemplate(testcase[0]), testcase[1]);
  });
});

Deno.test("pickQueries", () => {
  const testCases: TestCase<typeof pickQueries>[] = [
    ["", []],
    ["[id]", ["id"]],
    ["[piyo]/[hoge]", ["piyo", "hoge"]],
    ["[piyo]/[piyo]", ["piyo"]],
    ["[piyo]/[piyo]/[piyo]", ["piyo"]],
    ["[piyo]/[hoge]/[piyo]", ["piyo", "hoge"]],
  ];
  testCases.forEach((testcase) => {
    assertEquals<string[]>(pickQueries(testcase[0]), testcase[1]);
  });
});
