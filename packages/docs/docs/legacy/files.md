---
sidebar_position: 1
---

# File Methods

YamJS provides a set of file methods to work with file system operations. This guide will explain the essential methods and their usage.

## Creating a File Record

To create a file record, use the `file()` method. This method accepts a path, which can be a string, record, or a Java IO File, followed by an optional list of additional path segments.

Example:

```javascript
const myFile = file('/path/to/my-file.txt')
```

## File Record Properties and Methods

A file record provides several properties and methods to work with the file system:

### children

A getter property that returns an array of child records if the record represents a folder. Returns `null` if the record does not represent a folder.

### directory()

Ensures the record represents a directory. If the record type is 'none', it creates a new directory.

### entry()

Ensures the record represents a file. If the record type is 'none', it creates a new file in the parent directory.

### exists

A getter property that returns `true` if the file or directory exists, and `false` otherwise.

### file(...path)

Returns a new file record based on the given path segments relative to the current file record.

### flush()

Cleans up empty folders in the record's hierarchy, starting from the current record.

### json(async)

Reads the content of the record as a JSON object. If `async` is `true`, returns a promise that resolves to the JSON object.

### name

A getter property that returns the name of the file or directory.

### parent

A getter property that returns the parent record of the current record.

### path

A getter property that returns the normalized path of the record.

### read(async)

Reads the content of the file. If `async` is `true`, returns a promise that resolves to the file content as a string.

### remove()

Removes the file or directory, including any children recursively, and cleans up empty folders in the record's hierarchy.

### type

A getter property that returns the type of the record: 'folder', 'file', or 'none'.

### write(content, async)

Writes the given content to the file. If `async` is `true`, returns a promise that resolves when the content is written.

## Usage Examples

```javascript
// Create a new file record
const myFile = file('/path/to/my-file.txt')

// Ensure the file exists
myFile.entry()

// Write content to the file
myFile.write('Hello, World!')

// Read content from the file
const content = myFile.read()

// Remove the file
myFile.remove()
```
