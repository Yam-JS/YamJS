# @yam-js/dev-reload

@yam-js/dev-reload is a tool that enables fast reloading during development in YamJS.

# Installation

To install @yam-js/dev-reload, run the following command:

`npm install --dev @yam-js/dev-reload`

# Getting Started

## JavaScript

After installing, import initializeDevReload and execute it on plugin start. This will spawn a web server listening to the /reload route on port 8000.

```JavaScript
import { initializeDevReload } from '@yam-js/dev-reload';

initializeDevReload();
```

## Webpack

@yam-js/dev-reload comes with a webpack wrapper. To use it, replace your normal Webpack command with `yamjs-dev-webpack`.

This will start a Webpack development server with reloading enabled.

## Watcher

If you don't use webpack, no worries. You can use a watcher instead. Launch `yamjs-dev-watcher [path] [extensions]` with your server.

```
yamjs-dev-watcher src js
yamjs-dev-watcher src js,ts
yamjs-dev-watcher src js,jsx,ts,tsx
```
