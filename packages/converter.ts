import type { WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";
import { parse as parsePath } from "https://deno.land/std@0.130.0/path/mod.ts";
import type { Route, DynamicParam } from "./type/index.ts";
import { parseToDynamicParams } from "./parser.ts";

export const convertToBase = (root: string, entry: WalkEntry): string => {
  const parsed = parsePath(entry.path);
  const base = [
    parsed.dir.replace(new RegExp(`^${root}`), ""),
    parsed.name !== "index" ? `${parsed.name}/` : "",
  ].join("/");
  return base;
};

export const convertToDynamicParam = (
  name: string
): DynamicParam | undefined => {
  const restWithOptional = name.match(/^\[{2}\.{3}(\w+)\]{2}$/);
  if (restWithOptional) {
    return {
      type: "rest",
      name: restWithOptional[1],
      isOptional: true,
    };
  }
  const rest = name.match(/^\[\.{3}(\w+)\]$/);
  if (rest) {
    return {
      type: "rest",
      name: rest[1],
      isOptional: false,
    };
  }
  const key = name.match(/^\[(\w+)\]$/);
  if (key) {
    return {
      type: "single",
      name: key[1],
    };
  } else {
    return undefined;
  }
};

export const convertToTemplate = (original: string): string =>
  original
    .replaceAll(
      /\[{2}\.{3}(\w+)\]{2}/g,
      (_, name) => "${" + name + '.join("/")}'
    )
    .replaceAll(/\[\.{3}(\w+)\]/g, (_, name) => "${" + name + '.join("/")}')
    .replaceAll(/\[(\w+)\]/g, (_, name) => "${" + name + "}");

/**
 *
 * @param root Relative path of the directory to be searched by visitor
 * @param entry Entry retrieved by visitor
 * @returns Alternative types for entry that can be handled by generator
 */
export const convertToRoute = (root: string, entry: WalkEntry): Route => {
  const base = convertToBase(root, entry);
  const template = convertToTemplate(base);
  const params = parseToDynamicParams(base);
  return {
    identity: base,
    template,
    params,
  };
};
