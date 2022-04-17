import type { WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import type { TestCase } from "./_test_helper/testcase.ts";
import {
  convertToBase,
  convertToRoute,
  convertToTemplate,
  convertToDynamicParam,
} from "./converter.ts";

Deno.test("convertToBase", () => {
  const baseEntry: Omit<WalkEntry, "name" | "path"> = {
    isDirectory: false,
    isFile: true,
    isSymlink: false,
  };
  const testCases: TestCase<typeof convertToBase>[] = [
    ["pages", { ...baseEntry, name: "index.ts", path: "pages/index.ts" }, "/"],
  ];
  testCases.forEach((testcase) => {
    assertEquals(convertToBase(testcase[0], testcase[1]), testcase[2]);
  });
});

Deno.test("convertToDynamicParam", () => {
  const testCases: TestCase<typeof convertToDynamicParam>[] = [
    ["", undefined],
    ["hoge", undefined],
    ["[id]", { type: "single", name: "id" }],
    ["[...slug]", { type: "rest", name: "slug", isOptional: false }],
    ["[[...foo]]", { type: "rest", name: "foo", isOptional: true }],
  ];
  testCases.forEach((testcase) =>
    assertEquals(convertToDynamicParam(testcase[0]), testcase[1])
  );
});

Deno.test("convertToTemplate", () => {
  const testCases: TestCase<typeof convertToTemplate>[] = [
    ["/", "/"],
    ["/hoge/[id]", "/hoge/${id}"],
    ["/hoge/[id]/[id]", "/hoge/${id}/${id}"],
    ["/hoge/[...slug]", '/hoge/${slug.join("/")}'],
    ["/hoge/[[...rest]]", '/hoge/${rest.join("/")}'],
  ];
  testCases.forEach((testcase) => {
    assertEquals<string>(convertToTemplate(testcase[0]), testcase[1]);
  });
});

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
      { identity: "/", template: "/", params: [] },
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
        params: [],
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
        params: [],
      },
    ],
    [
      "pages",
      {
        path: "pages/fuga/[...slug].ts",
        name: "[...slug].ts",
        isDirectory: false,
        isFile: true,
        isSymlink: false,
      },
      {
        identity: "/fuga/[...slug]/",
        template: '/fuga/${slug.join("/")}/',
        params: [
          {
            type: "rest",
            name: "slug",
            isOptional: false,
          },
        ],
      },
    ],
  ];
  testCases.forEach((testcase) => {
    assertEquals(convertToRoute(testcase[0], testcase[1]), testcase[2]);
  });
});
