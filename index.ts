import { Project } from "ts_morph";
import { parse as parseArg } from "flags";
import { walkAround } from "./visitor.ts";
import { pickRoute } from "./gleaner.ts";
import { addEntry } from "./generator.ts";
import { ensureFileSync } from "fs";
import { RouteOptionStructure, RouteFunctionStructure } from "./structure.ts";

const main = async () => {
  const parsedArg = parseArg(Deno.args, { "--": false });
  const output = "utils/route/generated.ts";
  ensureFileSync(output);
  const encoder = new TextEncoder();
  await Deno.writeFileSync(output, encoder.encode(""));
  const tsconfig =
    typeof parsedArg.t === "string" ? parsedArg.t : "tsconfig.json";
  const project = new Project({ tsConfigFilePath: tsconfig });
  const root = typeof parsedArg.r === "string" ? parsedArg.r : "pages";
  const source = project.getSourceFile(output)!;
  source.addInterface(RouteOptionStructure);
  const routeConstructor = source.addFunction(RouteFunctionStructure);
  walkAround(root, (entry) => {
    const route = pickRoute(root, entry);
    addEntry(route, routeConstructor);
  });
  source.save();
};

main();
