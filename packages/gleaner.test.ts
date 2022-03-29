import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { pickRoute, convertToTemplate } from "./gleaner.ts";
import { Route } from "./type.ts";

Deno.test("[gleaner]pickRoute", () => {
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

Deno.test("[gleaner]convertToTemplate", () => {
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
