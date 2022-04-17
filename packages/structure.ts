import {
  InterfaceDeclarationStructure,
  FunctionDeclarationStructure,
  TypeAliasDeclarationStructure,
  StructureKind,
} from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import { Route, ParameterType } from "./type/index.ts";

export const RouteOptionStructure: InterfaceDeclarationStructure = {
  kind: StructureKind.Interface,
  name: "RouteOption",
  properties: [
    {
      name: "query",
      type: "{ [key: string]: string }",
      hasQuestionToken: true,
    },
    {
      name: "fragment",
      type: "string",
      hasQuestionToken: true,
    },
  ],
};

export const ParameterTypeStructure: TypeAliasDeclarationStructure = {
  kind: StructureKind.TypeAlias,
  name: "ParameterType",
  type: [
    ParameterType.Single,
    ParameterType.Rest,
    ParameterType.OptionalRest,
  ].join(" | "),
};

export const RouteFunctionStructure: FunctionDeclarationStructure = {
  kind: StructureKind.Function,
  name: "route",
  isExported: true,
  parameters: [
    { name: "identity", type: "Identity" },
    {
      name: "...args",
      type: "ParameterType[]",
    },
  ],
};

export const IdentityTypeStructure = (
  routes: [Pick<Route, "identity">, ...Pick<Route, "identity">[]]
): TypeAliasDeclarationStructure => {
  if (!routes.length) throw "routes is empty";
  return {
    kind: StructureKind.TypeAlias,
    name: "Identity",
    type: (writer) => {
      routes.forEach((route, index) => {
        writer.write(`"${route.identity}"`);
        if (routes.length > index + 1) writer.write(" | ");
      });
    },
  };
};
