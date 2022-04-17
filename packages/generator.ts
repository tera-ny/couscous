import { FunctionDeclaration } from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import { Route, ParameterType } from "./type/index.ts";

export const addEntryOverloads = (
  routes: Route[],
  constructor: FunctionDeclaration
) => {
  constructor.addOverloads(
    routes.map((route) => ({
      parameters: [
        { name: "identity", type: `"${route.identity}"` },
        ...route.params.map((parameter) => ({
          name: parameter.name,
          type: ParameterType.toType(parameter),
        })),
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
    writer.writeLine("let optionIndex: number;");
    writer.write("switch (identity)").block(() => {
      routes.forEach((route) => {
        writer.writeLine(`case "${route.identity}":`);
        writer.block(() => {
          route.params.forEach((param, index) => {
            writer.writeLine(
              `const ${param.name} = args[${index}] as ${ParameterType.toType(
                param
              )};`
            );
          });
          writer.writeLine("path = `" + route.template + "`;");
          const optionIndex = route.params.length;
          writer.writeLine(`optionIndex = ${optionIndex};`);
          writer.write("break;");
        });
      });
    });
    writer.writeLine(
      "const option = args[optionIndex] as (RouteOption | undefined);"
    );
    writer.writeLine("const query = new URLSearchParams(option?.query ?? {});");
    writer.writeLine(
      'return `${path}${query.toString() && "?" + query.toString}${option?.fragment && "#" + option.fragment}`'
    );
  });
};
