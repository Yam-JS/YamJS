---
sidebar_position: 3
---

# Write a "Hello World" Plugin

This guide will help you create a simple "Hello World" plugin using YamJS. We'll start with a basic console log and then show you examples of how to implement commands and events.

## Accessing Java Implementations

To access Java implementations from your JavaScript code, use the following syntax:

```javascript
const String = Java.type('java.lang.String')
```

## Creating a Hello World Plugin

1. Navigate to your plugin directory and find the `YamJS` folder.
2. Locate the `index.js` file inside the `YamJS` folder.
3. Open the `index.js` file in your preferred code editor and start modifying it.
4. Save your changes and reload the server.

### Example 1: Basic Console Log

Add the following line to `index.js` to log "Hello World" in the server console:

```javascript
console.log('Hello World')
```

### Example 2: Implementing a Command

Create a command that broadcasts "Hello World!" to all players on the server:

```javascript
command({
  name: 'hi',
  execute: () => {
    bukkitServer.broadcastMessage('Hello World!')
  },
})
```

From the game, run the command by typing `/hi`.

### Example 3: Handling an Event

Register an event that sends a welcome message to a player when they join the server:

```javascript
registerEvent(PlayerJoinEvent, (event) => {
  event.getPlayer().sendMessage(`Hello ${event.getPlayer().getName()}!`)
})
```

You can join the server and see the message in the chat.

Feel free to modify these examples or add new ones to fit your needs. As you continue to develop your plugin, you'll gain more experience working with YamJS, JavaScript, and Java implementations.
