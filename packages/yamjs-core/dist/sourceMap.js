"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLineToSource = exports.cacheSourceMap = void 0;
const vlq = require("vlq");
function createCachedMap(raw) {
    // Parse VLQ-formatted line and column positions
    const lines = raw.mappings.split(';').map((line) => line.split(','));
    const decoded = lines.map((line) => line.map((col) => vlq.decode(col)));
    return { sources: raw.sources, mappings: decoded, startOffset: 0 };
}
function loadSourceMap(fileContents) {
    const sourceMap = JSON.parse(fileContents);
    return createCachedMap(sourceMap);
}
/**
 * Cached source maps.
 */
const cachedMaps = new Map();
function cacheSourceMap(file, content, startOffset) {
    const map = loadSourceMap(content);
    if (map) {
        map.startOffset = startOffset;
        cachedMaps.set(file, map);
        return true;
    }
    return false;
}
exports.cacheSourceMap = cacheSourceMap;
function mapLineInternal({ mappings, sources }, jsLine) {
    // Advance through both files and lines in source map
    let sourceLine = 0;
    let sourceFile = 0;
    let result = 0;
    for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        line.forEach((segment) => {
            sourceLine += segment[2] ?? 0;
            sourceFile += segment[1] ?? 0;
        });
        // Return TS file/line number when we reach given JS line number
        if (i + 1 === jsLine) {
            result = sourceLine + 1;
            return {
                file: sources[sourceFile],
                line: result,
            };
        }
    }
    throw new Error(`source map failed for line ${jsLine}`);
}
function mapLineToSource(file, line) {
    const map = cachedMaps.get(`${file}`);
    if (map) {
        line -= map.startOffset; // Apply start offset
        if (line <= 0) {
            return { file: file, line: line }; // Not mapped line
        }
        const result = mapLineInternal(map, line);
        if (result.file.startsWith('webpack://test/')) {
            result.file = result.file.replace('webpack://test/', '');
        }
        if (result.file.startsWith('../')) {
            result.file = result.file.replace('../', './');
        }
        return result;
    }
    else {
        // Mapping not found, return original JS file and line
        return { file, line };
    }
}
exports.mapLineToSource = mapLineToSource;
