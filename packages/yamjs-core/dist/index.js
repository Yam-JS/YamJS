"use strict";
// TODO: This needs to be fixed and clarified.
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.file = exports.command = exports.reload = exports.load = exports.yamInitialize = void 0;
var initialize_1 = require("./initialize");
Object.defineProperty(exports, "yamInitialize", { enumerable: true, get: function () { return initialize_1.yamInitialize; } });
var legacy_1 = require("./legacy");
Object.defineProperty(exports, "load", { enumerable: true, get: function () { return legacy_1.load; } });
Object.defineProperty(exports, "reload", { enumerable: true, get: function () { return legacy_1.reload; } });
Object.defineProperty(exports, "command", { enumerable: true, get: function () { return legacy_1.command; } });
Object.defineProperty(exports, "file", { enumerable: true, get: function () { return legacy_1.file; } });
Object.defineProperty(exports, "context", { enumerable: true, get: function () { return legacy_1.context; } });
