---
sidebar_position: 1
---

# TypeScript Support

This guide will show you how to add TypeScript support to your YamJS project. You will need to install TypeScript, configure it for a CommonJS/Node.js environment, and use the `tsc` command to compile your TypeScript code into a single JavaScript file that goes into the `plugin/YamJS` folder.

## Installing TypeScript

1. Install TypeScript as a development dependency by running the following command:

   ```sh
   npm install --save-dev typescript
   ```

## Configuring TypeScript for a CommonJS/Node.js Environment

1. Create a `tsconfig.json` file in your project's root directory.

2. Add the following configuration to the `tsconfig.json` file:

   ```json
   {
     "compilerOptions": {
       "target": "ES2019",
       "module": "CommonJS",
       "strict": true,
       "esModuleInterop": true,
       "outDir": "./plugin/YamJS" // Change this to match your project's requirements
     },
     "include": ["./src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

   This configuration sets the target environment to ECMAScript 2019, specifies CommonJS as the module format, and sets the output directory to `./plugin/YamJS`. You may need to adjust these settings to match your project's requirements.

## Compiling TypeScript to a Single JavaScript File

1. Organize your TypeScript source files in the `./src` directory.

2. Compile your TypeScript files into a single JavaScript file by running the following command:

   ```sh
   npx tsc
   ```

   The compiled JavaScript file will be placed in the `./plugin/YamJS` directory as specified in the `tsconfig.json` file.

Now you have TypeScript support in your YamJS project. Write your plugin code in TypeScript and use the `tsc` command to compile it into JavaScript before running your Minecraft server.
