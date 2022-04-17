export type NonEmpty<T> = [T, ...T[]];

export const isNonEmpty = <T>(target: T[]): target is NonEmpty<T> => {
  return target.length > 0;
};
