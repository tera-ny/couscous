# CousCous

Couscous is a utility tool for next.js that automatically generates route functions by scanning .ts and .tsx files under the pages directory.

## Usage

`deno run --allow-read --allow-write https://deno.land/x/couscous/index.ts utils/route/generated.ts`

### options

- `-t <path>` tsconfig path. default `tsconfig.json`
- `-r <path>` page root. default `pages`

`deno run --allow-read --allow-write https://deno.land/x/couscous/index.ts src/utils/route/generated.ts -t configs/dev.tsconfig.json -r src/pages`

## Example

### directory structure

- `/index.tsx`
- `/users/[id]/index.tsx`
- `/api/hello.ts`
- `/users/[items].tsx`

### output

```typescript:generated.ts
interface RouteOption {
  query?: { [key: string]: string };
  hash?: `#${string}`;
}

type Identity = "/" | "/users/[id]/" | "/api/hello/" | "/items/[items]/";

function toSearch(searchParams: URLSearchParams): string {
  return searchParams.toString() ? "?" + searchParams.toString() : "";
}

export function route(identity: "/", option?: RouteOption): string;
export function route(
  identity: "/users/[id]/",
  id: string,
  option?: RouteOption
): string;
export function route(identity: "/api/hello/", option?: RouteOption): string;
export function route(
  identity: "/items/[items]/",
  items: string,
  option?: RouteOption
): string;
export function route(
  identity: Identity,
  ...args: (string | RouteOption | undefined)[]
) {
  let path: string;
  let index: number;
  switch (identity) {
    case "/":
      path = `/`;
      index = 0;
      break;
    case "/users/[id]/":
      const id = args[0];
      path = `/users/${id}/`;
      index = 1;
      break;
    case "/api/hello/":
      path = `/api/hello/`;
      index = 0;
      break;
    case "/items/[items]/":
      const items = args[0];
      path = `/items/${items}/`;
      index = 1;
      break;
  }
  const option = args[index] as RouteOption | undefined;
  const searchParams = new URLSearchParams(option?.query ?? {});
  return `${path}${toSearch(searchParams)}${option?.hash}`;
}

```

## Contributing

### testing with snapshot test

need to specify the flag
`deno test <target file> --allow-write --allow-read`

update snapshot test case
`deno test <target file> --allow-write --allow-read -- update_snapshot`
