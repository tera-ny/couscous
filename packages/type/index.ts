export * as ParameterType from "./parameterType.ts";
export { isNonEmpty } from "./nonEmpty.ts";
export type { NonEmpty } from "./nonEmpty.ts";

export type DynamicParam =
  | { type: "rest"; name: string; isOptional: boolean }
  | { type: "single"; name: string };

export interface Route {
  identity: string;
  template: string;
  params: DynamicParam[];
}
