import {
  Project,
  SourceFile,
  IndentationText,
  NewLineKind,
  QuoteKind,
} from "https://deno.land/x/ts_morph@14.0.0/mod.ts";
import { parse as parseArg } from "https://deno.land/std@0.130.0/flags/mod.ts";
import { walkAround } from "./visitor.ts";
import { convertToRoute } from "./converter.ts";
import { addEntryOverloads, addRoutesHandler } from "./generator.ts";
import { Route, isNonEmpty } from "./type.ts";
import { ensureFile } from "https://deno.land/std@0.130.0/fs/mod.ts";
import {
  RouteOptionStructure,
  RouteFunctionStructure,
  IdentityTypeStructure,
} from "./structure.ts";
import {
  brightGreen,
  brightRed,
} from "https://deno.land/std@0.135.0/fmt/colors.ts";

const pickRoutes = (root: string) => {
  const routes: Route[] = [];
  walkAround(root, (entry) => {
    const route = convertToRoute(root, entry);
    routes.push(route);
  });
  return routes;
};

const addRouteOption = (source: SourceFile) => {
  source.addInterface(RouteOptionStructure);
};

const addIdentityType = (routes: Route[], source: SourceFile) => {
  if (!isNonEmpty(routes)) return;
  source.addTypeAlias(IdentityTypeStructure(routes));
};

const addRouteFunction = (routes: Route[], source: SourceFile) => {
  if (!isNonEmpty(routes)) return;
  const routeConstructor = source.addFunction(RouteFunctionStructure);
  addEntryOverloads(routes, routeConstructor);
  addRoutesHandler(routes, routeConstructor);
};

const register = (routes: Route[], source: SourceFile) => {
  addRouteOption(source);
  addIdentityType(routes, source);
  addRouteFunction(routes, source);
};

const main = async () => {
  try {
    const parsedArg = parseArg(Deno.args, { "--": false });
    const output = parsedArg._[0] as string;

    console.log("Start generating 🚀");
    await ensureFile(output);

    const encoder = new TextEncoder();
    await Deno.writeFileSync(output, encoder.encode(""));

    const tsconfig =
      typeof parsedArg.t === "string" ? parsedArg.t : "tsconfig.json";
    const root = typeof parsedArg.r === "string" ? parsedArg.r : "pages";

    const project = new Project({
      tsConfigFilePath: tsconfig,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
        // LineFeed or CarriageReturnLineFeed
        newLineKind: NewLineKind.LineFeed,
        // Single or Double
        quoteKind: QuoteKind.Double,
      },
    });
    const source = project.getSourceFile(output)!;

    const routes = pickRoutes(root);
    register(routes, source);
    await source.save();
    console.log(
      [
        `\n`,
        brightGreen("Succeeded"),
        "generate code to",
        source.getFilePath(),
        "🎉",
        `\n`,
      ].join(" ")
    );
  } catch (error) {
    console.log(
      [`\n`, brightRed("Failed"), "Suspend due to a problem", "😤", `\n`].join(
        " "
      )
    );
    console.log("Error message...");
    console.error("\n", error, "\n");
  }
};

await main();
