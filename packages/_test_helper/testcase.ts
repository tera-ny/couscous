export type TestCase<T> = T extends (...args: infer A) => infer R
  ? [...A, R]
  : never;
