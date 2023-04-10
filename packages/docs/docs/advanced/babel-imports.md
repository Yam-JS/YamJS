# Using Babel Plugin Transform Graal Imports

This guide will show you how to use the `babel-plugin-transform-graal-imports` to simplify GraalVM imports in your YamJS project. This plugin allows you to use more intuitive import statements, like `import { Map } from 'java.util'`, instead of `const Map = Java.type('java.util.Map')`.

## Installation

First, make sure you have Babel installed in your project. If you don't have it installed, follow the [official Babel installation guide](https://babeljs.io/docs/en/installation).

Next, install `babel-plugin-transform-graal-imports` as a development dependency by running the following command:

```sh
npm install --save-dev babel-plugin-transform-graal-imports
```

## Configuration

1. Include the plugin in your Babel configuration file (`.babelrc` or `babel.config.js`):

   ```json
   {
     "presets": [
       ...
     ],
     "plugins": [
       ...
       "babel-plugin-transform-graal-imports"
     ]
   }
   ```

   You can also add additional options if needed:

   ```json
   {
     "presets": [
       ...
     ],
     "plugins": [
       ...
       ["babel-plugin-transform-graal-imports", {
         "objectName": "core",
         "propertyName": "type"
       }]
     ]
   }
   ```

   This configuration will change `Java.type` to `core.type`.

2. Make sure to add the type definitions, add the imports, and build your project.

Now you can use the more intuitive import statements in your YamJS project when working with GraalVM imports.
