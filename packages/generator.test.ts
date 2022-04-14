import { StructureKind } from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import { test } from "./_test_helper/fileSystem.ts";
import { assertSnapshot } from "./_test_helper/equal.ts";
import { addEntryOverloads } from "./generator.ts";

test("addEntryOverloads", async (source) => {
  const constructor = source.addFunction({
    name: "route",
    kind: StructureKind.Function,
    statements: 'return ""',
  });
  addEntryOverloads(
    [
      { identity: "/fuga", template: "/fuga/", params: [] },
      {
        identity: "/hoge/[hoge]",
        template: "/hoge/${hoge}",
        params: [{ name: "hoge", type: "param" }],
      },
      {
        identity: "/piyo/[...slug]",
        template: '/piyo/${slug.join("/")}',
        params: [{ name: "slug", type: "rest", isOptional: false }],
      },
      {
        identity: "/foo/[foo]/[...bar]",
        template: '/foo/${foo}/${bar.join("/")}',
        params: [
          { name: "foo", type: "param" },
          { name: "bar", type: "rest", isOptional: false },
        ],
      },
    ],
    constructor
  );
  await source.save();
  await assertSnapshot(
    source.getFilePath(),
    "_snapshots/generator_test_case0.snapshot"
  );
});
