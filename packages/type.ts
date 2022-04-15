export type DynamicParam =
  | { type: "rest"; name: string; isOptional: boolean }
  | { type: "param"; name: string };

export interface Route {
  identity: string;
  template: string;
  params: DynamicParam[];
}

type NonEmpty<T> = [T, ...T[]];

export const isNonEmpty = <T>(target: T[]): target is NonEmpty<T> => {
  return target.length > 0;
};
