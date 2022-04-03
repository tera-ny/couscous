import type { WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";
import { parse as parsePath } from "https://deno.land/std@0.130.0/path/mod.ts";
import type { Route } from "./type.ts";

export const generateBase = (root: string, entry: WalkEntry): string => {
  const parsed = parsePath(entry.path);
  const base = [
    parsed.dir.replace(new RegExp(`^${root}`), ""),
    parsed.name !== "index" ? `${parsed.name}/` : "",
  ].join("/");
  return base;
};

export const convertToTemplate = (original: string): string => {
  return original.replaceAll("[", "${").replaceAll("]", "}");
};

export const pickQueries = (path: string) =>
  [...path.matchAll(/\[(\w+)\]/g)]
    .map((val) => val[1])
    .filter((val, index, self) => self.indexOf(val) === index) ?? [];
/**
 *
 * @param root Relative path of the directory to be searched by visitor
 * @param entry Entry retrieved by visitor
 * @returns Alternative types for entry that can be handled by generator
 */
export const convertToRoute = (root: string, entry: WalkEntry): Route => {
  const base = generateBase(root, entry);
  const template = convertToTemplate(base);
  const query = pickQueries(base);

  return {
    identity: base,
    template,
    query,
  };
};
