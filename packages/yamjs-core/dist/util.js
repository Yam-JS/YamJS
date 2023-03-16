"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logVerbose = void 0;
let isVerboseLoggingEnabled = undefined;
const logVerbose = (...args) => {
    if (isVerboseLoggingEnabled === undefined) {
        isVerboseLoggingEnabled = Yam.getConfig().verbose;
    }
    if (isVerboseLoggingEnabled) {
        console.log(...args);
    }
};
exports.logVerbose = logVerbose;
