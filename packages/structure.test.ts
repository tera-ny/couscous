import { test } from "./_test_helper/fileSystem.ts";
import {
  RouteOptionStructure,
  IdentityTypeStructure,
  ParameterTypeStructure,
} from "./structure.ts";
import { assertSnapshot } from "https://deno.land/std/testing/snapshot.ts";

test("RouteOption with snapshot", async (source, ctx) => {
  source.addInterface(RouteOptionStructure);
  await source.save();
  const target = await Deno.readTextFile(source.getFilePath());
  await assertSnapshot(ctx, target);
});

test("ParameterType with snapshot", async (source, ctx) => {
  source.addTypeAlias(ParameterTypeStructure);
  await source.save();
  const target = await Deno.readTextFile(source.getFilePath());
  await assertSnapshot(ctx, target);
});

test("IdentityType with snapshot", async (source, ctx) => {
  source.addTypeAlias(
    IdentityTypeStructure([
      { identity: "foo" },
      { identity: "bar" },
      { identity: "hoge" },
      { identity: "piyo" },
      { identity: "fuga/${id}" },
    ])
  );
  await source.save();
  const target = await Deno.readTextFile(source.getFilePath());
  await assertSnapshot(ctx, target);
});
