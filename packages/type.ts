export type DynamicParam =
  | { type: "rest"; name: string; isOptional: boolean }
  | { type: "param"; name: string };

export interface Route {
  identity: string;
  template: string;
  params: DynamicParam[];
}
