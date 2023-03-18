"use strict";
// TODO: This needs to be fixed and clarified.
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.file = exports.command = exports.reload = exports.load = exports.initialize = void 0;
const core_1 = require("./core");
var initialize_1 = require("./initialize");
Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return initialize_1.initialize; } });
var legacy_1 = require("./legacy");
Object.defineProperty(exports, "load", { enumerable: true, get: function () { return legacy_1.load; } });
Object.defineProperty(exports, "reload", { enumerable: true, get: function () { return legacy_1.reload; } });
Object.defineProperty(exports, "command", { enumerable: true, get: function () { return legacy_1.command; } });
Object.defineProperty(exports, "file", { enumerable: true, get: function () { return legacy_1.file; } });
Object.defineProperty(exports, "context", { enumerable: true, get: function () { return legacy_1.context; } });
exports.default = core_1.YamJSCore;
