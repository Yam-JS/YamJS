"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamJSCore = void 0;
const errors_1 = require("./errors");
const initialize_1 = require("./initialize");
const legacy_1 = require("./legacy");
const reload_1 = require("./reload");
exports.YamJSCore = {
    createCommand: legacy_1.command,
    initialize: initialize_1.initialize,
    loadJar: legacy_1.load,
    reload: reload_1.reloadHandler.reload,
    logError: errors_1.logError,
    catchAndLogUnhandledError: errors_1.catchAndLogUnhandledError,
};
