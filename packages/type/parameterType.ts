import type { DynamicParam } from "./index.ts";

export const Single = "string";
export const Rest = "[string, ...string[]]";
export const OptionalRest = "string[]";

export const toType = (param: DynamicParam) => {
  switch (param.type) {
    case "single":
      return Single;
    case "rest": {
      if (param.isOptional) {
        return OptionalRest;
      } else {
        return Rest;
      }
    }
  }
};
