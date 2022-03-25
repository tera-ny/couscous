import {
  InterfaceDeclarationStructure,
  FunctionDeclarationStructure,
  StructureKind,
} from "ts_morph";

export const RouteOptionStructure: InterfaceDeclarationStructure = {
  kind: StructureKind.Interface,
  name: "RouteOption",
  properties: [
    {
      name: "query",
      type: "{ [key: string]: string }",
      hasQuestionToken: true,
    },
  ],
};

export const RouteFunctionStructure: FunctionDeclarationStructure = {
  kind: StructureKind.Function,
  name: "route",
  isExported: true,
  parameters: [
    { name: "identity", type: "string" },
    { name: "option", type: "RouteOption", hasQuestionToken: true },
  ],
};
