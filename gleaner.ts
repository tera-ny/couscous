import type { WalkEntry } from "fs";
import { parse as parsePath } from "path";
import type { Route } from "./type.ts";

export const pickRoute = (root: string, entry: WalkEntry): Route => {
  const parsed = parsePath(entry.path);
  const base = [
    parsed.dir.replace(new RegExp(`^${root}`), ""),
    parsed.name !== "index" ? `${parsed.name}/` : "",
  ].join("/");
  const replaced = base.replaceAll("[", "${").replaceAll("]", "}");
  const query = [...base.matchAll(/\[(\w+)\]/g)].map((val) => val[1]) ?? [];

  return {
    identity: base,
    template: replaced,
    query,
  };
};
