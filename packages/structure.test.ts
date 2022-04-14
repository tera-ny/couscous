import { test } from "./_test_helper/fileSystem.ts";
import {
  RouteOptionStructure,
  toSearchFunctionStructure,
} from "./structure.ts";
import { assertSnapshot } from "./_test_helper/equal.ts";

test("RouteOption with snapshot", async (source) => {
  source.addInterface(RouteOptionStructure);
  await source.save();
  await assertSnapshot(
    source.getFilePath(),
    "_snapshots/structure_test_routeoption.snapshot"
  );
});

test("toSearch with snapshot", async (source) => {
  source.addFunction(toSearchFunctionStructure);
  await source.save();
  await assertSnapshot(
    source.getFilePath(),
    "_snapshots/structure_test_tosearch.snapshot"
  );
});
