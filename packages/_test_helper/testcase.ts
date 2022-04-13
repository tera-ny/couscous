export type TestCase<U extends (...args: any) => any> = [
  ...Parameters<U>,
  ReturnType<U>
];
