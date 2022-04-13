import {
  assertEquals,
  equal,
} from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { copy } from "https://deno.land/std@0.132.0/fs/mod.ts";
export const assertSnapshot = async (
  receivedPath: string,
  expectedPath: string
) => {
  const [received, expected] = await Promise.all([
    Deno.readTextFile(receivedPath),
    Deno.readTextFile(expectedPath),
  ]);
  if (Deno.args.includes("update_snapshot")) {
    if (equal(received, expected)) return;
    await copy(receivedPath, expectedPath, { overwrite: true });
  } else {
    assertEquals(received, expected);
  }
};
