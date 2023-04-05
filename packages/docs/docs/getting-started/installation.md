---
sidebar_position: 1
---

# Installation

Welcome to the Installation guide for YamJS, a JavaScript library for developing plugins within a GraalVM environment in Minecraft. This guide will walk you through the steps necessary to set up your development environment, install the required dependencies, and get your server up and running.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Java](https://www.java.com/en/download/) (must be supported by Minecraft)
- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)

## Setup

1. **Download the latest Java jar plugin**

   Navigate to the [YamJS repository on GitHub](https://github.com/Yam-JS/YamJS) and download the latest release of the Java jar plugin.

2. **Add the jar file to your plugins folder**

   Locate your Minecraft server's `plugins` folder and copy the downloaded jar file into it. If the `plugins` folder doesn't exist, create one.

3. **Install the YamJS core and legacy packages**

   Open a terminal or command prompt and navigate to your project's root folder. Run the following commands to install the YamJS core and legacy packages:

```
npm install @yam-js/core
npm install @yam-js/legacy
```

These commands will install the necessary dependencies for your project.

4. **Start your Minecraft server**

Start your Minecraft server using the appropriate command or script, depending on your server's configuration. After starting the server, the YamJS plugin should load automatically, and you should see related messages in the server's console.

Congratulations! You've successfully set up the YamJS library. You can now start developing JavaScript plugins for Minecraft within the GraalVM environment. To learn more about creating plugins with YamJS, explore the [documentation](https://yam-js.github.io/docs) and refer to the available examples.
