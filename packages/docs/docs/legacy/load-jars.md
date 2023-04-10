---
sidebar_position: 2
---

# Loading a Java JAR from Local File System

In YamJS, you can load a Java class from a JAR file located on your local file system. This guide will walk you through the provided `load()` function and its usage.

## The load() Function

The `load()` function allows you to load a Java class from a JAR file. The function accepts two arguments:

1. `path`: A string, record, or Java IO File (jiFile) representing the path to the JAR file.
2. `name`: A string representing the fully qualified name of the Java class you want to load.

The function returns an instance of the specified Java class.

## Usage Example

```javascript
import { load } from '@yam-js/legacy'

// Load a Java class from a JAR file
const MyClass = load('/path/to/my-library.jar', 'com.example.MyClass')
```

```javascript
import { load } from '@yam-js/legacy'

const FetchClient = load('./plugins/grakkit/fetchClient.jar', 'fetch.FetchClient')
```

## Implementation Details

The JavaScript implementation of the `load()` function first checks if the specified class has already been loaded in the current session. If the class is already loaded, it returns the cached instance. Otherwise, it calls the Java-side `Yam.load()` method to load the class from the specified JAR file.

The Java-side `Yam.load()` method accepts a Java File object representing the JAR file and the fully qualified name of the Java class to load. It uses a URLClassLoader to load the class from the provided JAR file and caches the class loader for future use.

## Note

Ensure that you have the proper file path to the JAR file and the correct fully qualified name of the Java class to avoid errors.
