import { test } from "./_test_helper/fileSystem.ts";
import { RouteOptionStructure, IdentityTypeStructure } from "./structure.ts";
import { assertSnapshot } from "./_test_helper/equal.ts";

test("RouteOption with snapshot", async (source) => {
  source.addInterface(RouteOptionStructure);
  await source.save();
  await assertSnapshot(
    source.getFilePath(),
    "_snapshots/structure_test_routeoption.snapshot"
  );
});

test("IdentityType with snapshot", async (source) => {
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
  await assertSnapshot(
    source.getFilePath(),
    "_snapshots/structure_test_identitytype.snapshot"
  );
});
