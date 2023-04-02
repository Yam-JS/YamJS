<h1 align="center"> YamJS: Yet Another Minecraft JavaScript (Solution)</h1>

<p align="center">
  <img alt="Github Stars" src="https://badgen.net/github/stars/yam-js/yamjs" />
  <img alt="Commits per month" src="https://img.shields.io/github/commit-activity/m/yam-js/yamjs" />
  <a href="https://discord.gg/ntbqxNuNGE">
    <img alt="Discord" src="https://img.shields.io/discord/1091549342239817919?color=7389D8&label=%20&logo=discord&logoColor=ffffff&style=plastic" />
  </a>
  <img alt="Vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/github/yam-js/yamjs?style=plastic" />
</p>

YamJS is a fork of Grakkit, a popular Minecraft plugin for scripting with JavaScript. Our goal is to continue building on the great work that has already been done, while making it more relevant and useful for today's developers.

## Packages

| Packages | Badges |
| --- | --- |
| Plugin | <img alt="Plugin Downloads" src="https://img.shields.io/github/downloads/yam-js/yamjs/total?style=plastic"/> |
| [@yam-js/core](https://www.npmjs.com/package/@yam-js/core) | <img alt="Version" src="https://img.shields.io/github/package-json/v/yam-js/yamjs?color=gray&filename=packages%2Fyamjs-core%2Fpackage.json&label=%20&style=plastic"/> <img alt="Download" src="https://img.shields.io/npm/dt/@yam-js/core?style=plastic"/> |
| [@yam-js/legacy](https://www.npmjs.com/package/@yam-js/legacy) | <img alt="Version" src="https://img.shields.io/github/package-json/v/yam-js/yamjs?color=gray&filename=packages%2Fyamjs-legacy%2Fpackage.json&label=%20&style=plastic"/> <img alt="Legacy Download" src="https://img.shields.io/npm/dt/@yam-js/legacy?style=plastic"/> |
| [@yam-js/build](https://www.npmjs.com/package/@yam-js/build) | <img alt="Version" src="https://img.shields.io/github/package-json/v/yam-js/yamjs?color=gray&filename=packages%2Fbuild%2Fpackage.json&label=%20&style=plastic"/> <img alt="Build Download" src="https://img.shields.io/npm/dt/@yam-js/build?style=plastic"/> |
| [@yam-js/test-util](https://www.npmjs.com/package/@yam-js/test-util) | <img alt="Version" src="https://img.shields.io/github/package-json/v/yam-js/yamjs?color=gray&filename=packages%2Fyamjs-test-util%2Fpackage.json&label=%20&style=plastic"/> <img alt="Test Util Download" src="https://img.shields.io/npm/dt/@yam-js/test-util?style=plastic"/> |
| [@yam-js/graal-type-introspection](https://www.npmjs.com/package/@yam-js/graal-type-introspection) | <img alt="Version" src="https://img.shields.io/github/package-json/v/yam-js/yamjs?color=gray&filename=packages%2Fgraal-type-introspection%2Fpackage.json&label=%20&style=plastic"/> <img alt="Graal Type Download" src="https://img.shields.io/npm/dt/@yam-js/graal-type-introspection?style=plastic"/> |

# Why a Fork?

The original implementation is in maintenance mode, which means it is no longer being actively developed or updated. Our fork allows us to continue developing the project and providing new features and improvements.

# Active Development

YamJS is currently in alpha, so please note that there may be changes to the APIs and other aspects of the codebase as we continue to refine and improve it. While most APIs may be stable, it is possible that the next minor release may feature a breaking change during this phase.

# What will be different?

- Improved stability

  - Ticker was re-written from the ground up.
  - Improved lifecycle management.

- Improved Developer Experience

  - Significantly improved Type Definition support.
  - Better Error Handling.
  - Source Map Support.
  - Dev Autoreload support.

- Greater confidence

  - Significantly improved test coverage.
  - Improved CI/CD pipeline.

- TBD
