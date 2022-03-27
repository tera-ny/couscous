import { walkSync, WalkEntry } from "fs";

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
