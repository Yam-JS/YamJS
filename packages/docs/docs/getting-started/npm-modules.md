---
sidebar_position: 4
---

# NPM Dependencies

YamJS allows you to leverage npm packages and dependencies to enhance your plugin's functionality. However, there are some limitations and caveats that you should be aware of when using dependencies in YamJS.

## Dependencies You Can Use

In general, you can use npm packages that do not specifically rely on Node.js or browser environments. These packages should be platform-agnostic or compatible with the Java/GraalVM environment.

When choosing a dependency, look for packages that:

1. Are not tied to any specific environment (Node.js, browser, etc.).
2. Do not rely on native bindings or platform-specific APIs.
3. Are compatible with the ECMAScript versions supported by GraalVM.

Here are a few examples of packages that you can safely use:

- Lodash
- Moment.js
- DayJS
- GraphQL
- Redux
- uuid
- Valtio
- Yaml

## Dependencies to Avoid

Avoid using packages that depend on Node.js or browser-specific features, as they will not work properly in the GraalVM environment. Examples of these types of packages include:

- Express
- Axios
- Puppeteer
- Any packages that rely on the \`fs\`, \`http\`, or \`path\` Node.js modules

## Tips for Finding Compatible Dependencies

1. Read the package documentation carefully. Look for information about platform compatibility, required runtime environments, and any known limitations.
2. Test the package in a separate project before including it in your YamJS plugin. This can help you identify any compatibility issues before you spend time integrating it into your plugin.
3. When in doubt, reach out to the package maintainers or ask for help in relevant community forums.

By carefully selecting your dependencies and ensuring they are compatible with the GraalVM environment, you can greatly enhance the functionality and capabilities of your YamJS plugins.
