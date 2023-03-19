# Graal Type Introspection

This is an experimental package that scans the user's installed graal-types, generates a JavaType.d.ts file, and allows `@yam-js/core` to pull in those types automatically into `Java.type`.

# Note

The developer will need to add `@yam-js` into `typeRoots` within their `tsconfig.json` file

# Grakkit

This is possible to be added into an existing Grakkit package, however, there are a few caveats.

- You need to use `patch-package` to remove `declare const Java: any;` from `@grakkit/stdlib/scope.d.ts`.
- Once removed, you can declare your own typedef in a `d.ts` file. For example:

```typescript
import { JavaTypes } from '@yam-js/graal-type-introspection'

type JavaTypeKey<T extends string> = T | keyof JavaTypes

export type Java = {
  type: <Key extends string>(name: JavaTypeKey<Key>) => JavaTypes[Key]
  extend: any
}

declare global {
  const Java: Java
}
```
