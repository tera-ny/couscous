import {
  Project,
  SourceFile,
  ManipulationSettings,
  IndentationText,
} from "https://deno.land/x/ts_morph@14.0.0/mod.ts";

export const withDir = async (
  cb: (tempDir: string) => void | Promise<void>
) => {
  const tempDir = await Deno.makeTempDir({
    prefix: "deno_couscous_test_",
  });
  await cb(tempDir);
  await Deno.remove(tempDir, { recursive: true });
};

export const withSource = (
  cb: (tempSrc: SourceFile) => void | Promise<void>,
  manipulationSettings: Partial<ManipulationSettings> = {
    indentationText: IndentationText.TwoSpaces,
  }
) =>
  withDir(async (tempDir) => {
    const tempFile = await Deno.makeTempFile({ dir: tempDir });
    const project = new Project({
      libFolderPath: tempDir,
      manipulationSettings,
    });
    const source = project.addSourceFileAtPath(tempFile);
    await cb(source);
  });

type TestParameter = Deno.TestContext | TestCallback;
type TestCallback = (
  tempSrc: SourceFile,
  context: Deno.TestContext
) => void | Promise<void>;

export function test(name: string, cb: TestCallback): void;
export function test(
  name: string,
  context: Deno.TestContext,
  cb: TestCallback
): Promise<boolean>;
export function test(name: string, ...args: TestParameter[]) {
  if (typeof args[0] === "function") {
    const cb = args[0] as TestCallback;
    Deno.test(name, { permissions: { read: true, write: true } }, (t) =>
      withSource((source) => cb(source, t))
    );
  } else {
    const context = args[0] as Deno.TestContext;
    const cb = args[1] as TestCallback;
    return context.step(name, (t) => withSource((source) => cb(source, t)));
  }
}
