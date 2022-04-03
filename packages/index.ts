import {
  Project,
  SourceFile,
} from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import { parse as parseArg } from "https://deno.land/std@0.130.0/flags/mod.ts";
import { walkAround } from "./visitor.ts";
import { convertToRoute } from "./converter.ts";
import { addEntryOverloads, addRoutesHandler } from "./generator.ts";
import { Route } from "./type.ts";
import { ensureFileSync } from "https://deno.land/std@0.130.0/fs/mod.ts";
import {
  RouteOptionStructure,
  RouteFunctionStructure,
  IdentityTypeStructure,
  toSearchFunctionStructure,
} from "./structure.ts";

const pickRoutes = (root: string) => {
  const routes: Route[] = [];
  walkAround(root, (entry) => {
    const route = convertToRoute(root, entry);
    routes.push(route);
  });
  return routes;
};

const register = (routes: Route[], source: SourceFile) => {
  source.addInterface(RouteOptionStructure);
  source.addTypeAlias(IdentityTypeStructure(routes));
  source.addFunction(toSearchFunctionStructure);
  const routeConstructor = source.addFunction(RouteFunctionStructure);
  addEntryOverloads(routes, routeConstructor);
  addRoutesHandler(routes, routeConstructor);
};

const main = async () => {
  const parsedArg = parseArg(Deno.args, { "--": false });
  const output = parsedArg._[0] as string;
  ensureFileSync(output);

  const encoder = new TextEncoder();
  await Deno.writeFileSync(output, encoder.encode(""));

  const tsconfig =
    typeof parsedArg.t === "string" ? parsedArg.t : "tsconfig.json";
  const root = typeof parsedArg.r === "string" ? parsedArg.r : "pages";

  const project = new Project({ tsConfigFilePath: tsconfig });
  const source = project.getSourceFile(output)!;

  const routes = pickRoutes(root);
  register(routes, source);
  source.save();
};

main();
