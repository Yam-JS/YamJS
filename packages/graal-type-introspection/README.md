# Graal Type Introspection

This is an experimental package that scans the user's installed graal-types, generates a JavaType.d.ts file, and allows `@yam-js/core` to pull in those types automatically into `Java.type`.

# Note

The developer will need to add `@yam-js/graal-type-introspection` into `typeRoots` within their `tsconfig.json` file
