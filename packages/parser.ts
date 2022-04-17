import { convertToDynamicParam } from "./converter.ts";
import type { DynamicParam } from "./type/index.ts";

export const parseToDynamicParams = (path: string) => {
  const results: DynamicParam[] = [];
  path.split("/").forEach((name) => {
    const param = convertToDynamicParam(name);
    if (param) {
      results.push(param);
    }
  });
  return results;
};
