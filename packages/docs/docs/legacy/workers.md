---
sidebar_position: 3
---

# Working with Contexts

Contexts in YamJS act as a "worker-like" concept, allowing you to create isolated environments for executing your code. This guide will explain the essential methods for creating and managing contexts in YamJS.

## Key Methods

YamJS provides several built-in methods to work with contexts. You don't need to install any additional modules for these:

- `YamJS.fileInstance()`
- `YamJS.scriptInstance()`
- `YamJS.getMeta()`
- `YamJS.on()`
- `YamJS.off()`
- `YamJS.emit()`
- `YamJS.destroy()`

### Creating Instances

You can create a new context instance using `YamJS.fileInstance()` or `YamJS.scriptInstance()`. Both methods take two arguments:

1. **Execution target**: For `fileInstance`, this is the path to the file you want to execute. For `scriptInstance`, it's the raw JavaScript code string.
2. **Meta value**: This value is passed into the child context and can be used for context self-identification.

Example:

```javascript
const instance = YamJS.fileInstance('plugins/yamjs/test.js', 'test')
instance.open()
```

**Note**: Running these functions does not execute anything on their own. To execute the code, you need to call `instance.open()`.

### Accessing Meta Value

You can use `YamJS.getMeta()` to access the meta value in the current context. In the main context, this is "yamjs". In the child context, given the previous example, the value returned by `YamJS.getMeta()` would be "test".

### Cross-context Messaging

To communicate between contexts, use `YamJS.on()`, `YamJS.off()`, and `YamJS.emit()`. These methods work with channels and listeners for sending and receiving messages between contexts:

- `YamJS.on(channelName, listener)`: Attach a listener to a channel.
- `YamJS.off(channelName, listener)`: Remove a listener from a channel.
- `YamJS.emit(channelName, data)`: Emit data to a channel.

Example:

In the main context:

```javascript
YamJS.on('someArbitraryChannel', (data) => {
  console.log(data)
})
```

In a child context (or any context, as the event pool is the same for all contexts):

```javascript
YamJS.emit('someArbitraryChannel', 'Hello World!')
```

In the console, you will see: "Hello World!"

### Destroying Instances

Use `YamJS.destroy()` to self-destruct an instance from within. This functionality is disabled in the main context.
