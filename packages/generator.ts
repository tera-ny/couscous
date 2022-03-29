import { FunctionDeclaration } from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import type { Route } from "./type.ts";

export const addEntryOverloads = (
  routes: Route[],
  constructor: FunctionDeclaration
) => {
  constructor.addOverloads(
    routes.map((route) => ({
      parameters: [
        { name: "identity", type: `"${route.identity}"` },
        ...route.query.map((key) => ({ name: key, type: "string" })),
        {
          name: "option",
          hasQuestionToken: true,
          type: "RouteOption",
        },
      ],
      returnType: "string",
    }))
  );
};

export const addRoutesHandler = (
  routes: Route[],
  routesHandler: FunctionDeclaration
) => {
  routesHandler.addStatements((writer) => {
    writer.writeLine("let path: string;");
    writer.writeLine("let index: number;");
    writer.write("switch (identity)").block(() => {
      routes.forEach((route) => {
        writer.writeLine(`case "${route.identity}":`);
        writer.block(() => {
          route.query.forEach((key, index) => {
            writer.writeLine(`const ${key} = args[${index}];`);
          });
          writer.writeLine("path = `" + route.template + "`;");
          const optionIndex = route.query.length;
          writer.writeLine(`index = ${optionIndex};`);
          writer.write("break;");
        });
      });
    });
    writer.writeLine(
      "const option = args[index] as (RouteOption | undefined);"
    );
    writer.writeLine(
      "const searchParams = new URLSearchParams(option?.query ?? {});"
    );
    writer.writeLine(
      "return `${path}${toSearch(searchParams)}${option?.hash}`"
    );
  });
};
