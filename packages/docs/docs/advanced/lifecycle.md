---
sidebar_position: 5
---

# Lifecycles

YamJS provides lifecycle management for its core implementation and its individual contexts/workers. This guide will walk you through the provided lifecycle functions and their usage.

## Lifecycle Functions

The lifecycle handler in YamJS provides the following functions:

1. `enable()`: Manually enables the YamJS JavaScript portion. This function is usually called automatically, but if disabled, you can call this manually.
2. `reload()`: Reloads the entire JavaScript portion of YamJS, ensuring that callbacks registered for the "disable" lifecycle event are executed before reloading.
3. `on(name, config)`: Registers a callback to be executed when a lifecycle event occurs.

## Usage Example

```javascript
import { lifecycle } from '@yam-js/core'

// Register a callback for the 'enable' lifecycle event
const unregisterEnableCallback = lifecycle.on('enable', {
  name: 'MyEnableCallback',
  callback: () => {
    console.log('YamJS has been enabled.')
  },
  priority: 2,
})

// Register a callback for the 'disable' lifecycle event
const unregisterDisableCallback = lifecycle.on('disable', {
  name: 'MyDisableCallback',
  callback: () => {
    console.log('YamJS has been disabled.')
  },
  priority: 4,
})

// Manually enable YamJS (only necessary if initialization is disabled)
lifecycle.enable()

// Reload YamJS
lifecycle.reload()
```

## Lifecycle Configuration

When registering a callback using the `on()` function, you can provide a `LifecycleConfig` object, which has the following properties:

1. `name` (optional): A string used to identify the callback.
2. `callback`: A function to be executed when the specified lifecycle event occurs.
3. `priority` (optional): A number between 1 and 5 that controls the order of execution, where a lower number indicates earlier execution and a higher number indicates later execution. The default value is 3.

## Unregistering Callbacks

The `on()` function returns an `unregister` function that you can call to unregister the registered callback. This function can be useful in cases where you no longer want to execute the callback when the lifecycle event occurs.

```javascript
// Unregister the 'enable' callback
unregisterEnableCallback()

// Unregister the 'disable' callback
unregisterDisableCallback()
```

You can now copy and paste this content into your "Lifecycle in YamJS" page. If you have any further requests or need additional changes, please let me know.
