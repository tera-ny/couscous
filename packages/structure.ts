import {
  InterfaceDeclarationStructure,
  FunctionDeclarationStructure,
  TypeAliasDeclarationStructure,
  StructureKind,
} from "ts_morph";
import { Route } from "./type.ts";

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
      name: "hash",
      type: "`#${string}`",
      hasQuestionToken: true,
    },
  ],
};

export const RouteFunctionStructure: FunctionDeclarationStructure = {
  kind: StructureKind.Function,
  name: "route",
  isExported: true,
  parameters: [
    { name: "identity", type: "Identity" },
    {
      name: "...args",
      type: "(string | RouteOption | undefined)[]",
    },
  ],
};

export const toSearchFunctionStructure: FunctionDeclarationStructure = {
  kind: StructureKind.Function,
  name: "toSearch",
  parameters: [{ name: "searchParams", type: "URLSearchParams" }],
  returnType: "string",
  statements: (writer) => {
    writer.writeLine(
      'return searchParams.toString() ? "?" + searchParams.toString() : "";'
    );
  },
};

export const IdentityTypeStructure = (
  routes: Route[]
): TypeAliasDeclarationStructure => ({
  kind: StructureKind.TypeAlias,
  name: "Identity",
  type: (writer) => {
    routes.forEach((route, index) => {
      writer.write(`"${route.identity}"`);
      if (routes.length > index + 1) writer.write(" | ");
    });
  },
});
