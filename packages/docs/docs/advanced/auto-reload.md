---
sidebar_position: 2
---

# Automatic Reloading

To speed up your development process when working with YamJS, you can use the `@yam-js/dev-reload` library. This library will automatically reload the YamJS environment when you make changes to your code.

## Installation

Install `@yam-js/dev-reload` as a development dependency by running the following command:

```sh
npm install --save-dev @yam-js/dev-reload
```

## Getting Started

### JavaScript

After installing, import `initializeDevReload` and execute it on plugin start. This will spawn a web server listening to the `/reload` route on port 8000.

```javascript
import { initializeDevReload } from '@yam-js/dev-reload'

initializeDevReload()
```

### Webpack

`@yam-js/dev-reload` comes with a Webpack wrapper. To use it, replace your normal Webpack command with `yamjs-dev-webpack`.

This will start a Webpack development server with reloading enabled.

### Watcher

If you don't use Webpack, you can use a watcher instead. Launch `yamjs-dev-watcher [path] [extensions]` with your server.

```sh
yamjs-dev-watcher src js
yamjs-dev-watcher src js,ts
yamjs-dev-watcher src js,jsx,ts,tsx
```

By using `@yam-js/dev-reload`, you can speed up your development process and make it easier to iterate on your code while working with YamJS.
