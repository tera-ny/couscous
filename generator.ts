import { FunctionDeclaration } from "ts_morph";
import type { Route } from "./type.ts";

export const addEntry = (route: Route, constructor: FunctionDeclaration) => {
  constructor.addOverload({
    parameters: [{ name: "identity", type: `"${route.identity}"` }],
    returnType: "void",
  });
};

const test = {
  "/users/[id]/": () => {},
};
test["/users/[id]/"]();
