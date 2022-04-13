import { convertToDynamicParam } from "./converter.ts";
import { DynamicParam } from "./type.ts";

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
