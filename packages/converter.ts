import type { WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";
import { parse as parsePath } from "https://deno.land/std@0.130.0/path/mod.ts";
import type { Route } from "./type.ts";
import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";

export const convertToTemplate = (original: string): string => {
  return original.replaceAll("[", "${").replaceAll("]", "}");
};

export const pickRoute = (root: string, entry: WalkEntry): Route => {
  const parsed = parsePath(entry.path);
  const base = [
    parsed.dir.replace(new RegExp(`^${root}`), ""),
    parsed.name !== "index" ? `${parsed.name}/` : "",
  ].join("/");
  const query = [...base.matchAll(/\[(\w+)\]/g)].map((val) => val[1]) ?? [];

  return {
    identity: base,
    template: convertToTemplate(base),
    query,
  };
};

Deno.test("[converter]pickRoute", () => {
  assertEquals<Route>(
    pickRoute("pages", {
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
    pickRoute("pages", {
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
    pickRoute("pages", {
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
