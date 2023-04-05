---
sidebar_position: 2
---

# Java Intellisense

YamJS relies on the `@graal-types` library to provide type definitions for its Java implementations. These type definitions enable intellisense and improve the developer experience when working with the library. This guide will help you find and install the appropriate type definitions for your project.

## Finding the Appropriate Type Definitions

1. Visit the [Graal Types repository on GitHub](https://github.com/graal-types/graal-types).

2. Browse the repository to find the type definitions that match your project's Java version, Server flavor/version, as well as any plugins.

3. If the type definitions you need are not available, you can create a new issue on the repository to request them.

## Installing Type Definitions

To install the required type definitions, you'll need to use the following command:

```sh
npm install --save-dev @graal-types/{LIBRARY}
```

Replace `{LIBRARY}` with the name of the type definition library you want to install.

### Examples

- For Java 16, run:

  ```sh
  npm install --save-dev @graal-types/java-16
  ```

- For Minecraft Paper 1.18, run:

  ```sh
  npm install --save-dev @graal-types/paper-1.18
  ```

## Usage

After installing the appropriate type definitions, your development environment should automatically provide intellisense and improved autocompletion when working with Java implementations in your project.

For example, `Java.type('org.bukkit.Bukkit')` should provide intellisense for the `Bukkit` class.

## Caveats

The type definitions provided by the `@graal-types` library are not always complete. This is because the library is still in its early stages of development and relies on community contributions to provide type definitions for the various Java libraries.

If you find that a type definition is missing, you can create a new issue on the [Graal Types repository on GitHub](https://github.com/graal-types/graal-types) to request it.

In the meantime, you can use the `@ts-ignore` directive to ignore the missing type definition and rely on the official JavaDocs for further information.
