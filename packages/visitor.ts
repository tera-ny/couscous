import { walkSync, WalkEntry } from "https://deno.land/std@0.130.0/fs/mod.ts";

const reservedPath = ["_app.tsx", "_document.tsx"];

export const walkAround = (
  root: string,
  callback: (entry: WalkEntry) => void
) => {
  for (const entry of walkSync(root)) {
    if (entry.isFile && !reservedPath.includes(entry.name)) {
      callback(entry);
    }
  }
};
