type Hoge = "" | "piyo";

type Option = {};

export function route(type: "piyo", identity: string, option?: Option): void;
export function route(type: "", option?: Option): void;
export function route(
  type: Hoge,
  ...args: (string | number | Option | undefined)[]
) {}
