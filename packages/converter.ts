import type { WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";
import { parse as parsePath } from "https://deno.land/std@0.130.0/path/mod.ts";
import type { Route } from "./type.ts";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";

const generateBase = (root: string, entry: WalkEntry): string => {
  const parsed = parsePath(entry.path);
  const base = [
    parsed.dir.replace(new RegExp(`^${root}`), ""),
    parsed.name !== "index" ? `${parsed.name}/` : "",
  ].join("/");
  return base;
};

const convertToTemplate = (original: string): string => {
  return original.replaceAll("[", "${").replaceAll("]", "}");
};

const pickQueries = (path: string) =>
  [...path.matchAll(/\[(\w+)\]/g)]
    .map((val) => val[1])
    .filter((val, index, self) => self.indexOf(val) === index) ?? [];
/**
 *
 * @param root Relative path of the directory to be searched by visitor
 * @param entry Entry retrieved by visitor
 * @returns Alternative types for entry that can be handled by generator
 */
export const convertToRoute = (root: string, entry: WalkEntry): Route => {
  const base = generateBase(root, entry);
  const template = convertToTemplate(base);
  const query = pickQueries(base);

  return {
    identity: base,
    template,
    query,
  };
};

Deno.test("[converter]convertToRoute", () => {
  assertEquals<Route>(
    convertToRoute("pages", {
      path: "pages/index.ts",
      name: "index.ts",
      isDirectory: false,
      isFile: true,
      isSymlink: false,
    }),
    {
      identity: "/",
      template: "/",
      query: [],
    }
  );
  assertEquals<Route>(
    convertToRoute("pages", {
      path: "pages/fuga.ts",
      name: "fuga.ts",
      isDirectory: false,
      isFile: true,
      isSymlink: false,
    }),
    {
      identity: "/fuga/",
      template: "/fuga/",
      query: [],
    }
  );
  assertEquals<Route>(
    convertToRoute("pages", {
      path: "pages/fuga/index.ts",
      name: "index.ts",
      isDirectory: false,
      isFile: true,
      isSymlink: false,
    }),
    {
      identity: "/fuga/",
      template: "/fuga/",
      query: [],
    }
  );
});

Deno.test("[converter]convertToTemplate", () => {
  const testCases: { original: string; expected: string }[] = [
    {
      original: "/",
      expected: "/",
    },
    {
      original: "/hoge/[id]",
      expected: "/hoge/${id}",
    },
    {
      original: "/hoge/[id]/[id]",
      expected: "/hoge/${id}/${id}",
    },
  ];
  testCases.forEach((testcase) => {
    assertEquals<string>(
      convertToTemplate(testcase.original),
      testcase.expected
    );
  });
});

Deno.test("[converter]pickQueries", () => {
  const testCases: { path: string; expected: string[] }[] = [
    { path: "", expected: [] },
    { path: "[id]", expected: ["id"] },
    { path: "[piyo]/[hoge]", expected: ["piyo", "hoge"] },
    { path: "[piyo]/[piyo]", expected: ["piyo"] },
    { path: "[piyo]/[piyo]/[piyo]", expected: ["piyo"] },
    { path: "[piyo]/[hoge]/[piyo]", expected: ["piyo", "hoge"] },
  ];
  testCases.forEach((testcase) => {
    assertEquals<string[]>(pickQueries(testcase.path), testcase.expected);
  });
});
