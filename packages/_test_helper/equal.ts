import { assertEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { copy, ensureFile } from "https://deno.land/std@0.132.0/fs/mod.ts";
export const assertSnapshot = async (
  receivedPath: string,
  expectedPath: string
) => {
  if (Deno.args.includes("update_snapshot")) {
    await ensureFile(expectedPath);
    await copy(receivedPath, expectedPath, { overwrite: true });
  } else {
    const [received, expected] = await Promise.all([
      Deno.readTextFile(receivedPath),
      Deno.readTextFile(expectedPath),
    ]);
    assertEquals(received, expected);
  }
};
