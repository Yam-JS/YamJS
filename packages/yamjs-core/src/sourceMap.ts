import * as vlq from 'vlq'

interface RawSourceMap {
  /**
   * List of source files used for this map.
   */
  sources: string[]

  /**
   * Actual mappings.
   */
  mappings: string
}

interface SourceMap {
  /**
   * List of source files used for this map.
   */
  sources: string[]

  /**
   * Actual mappings.
   */
  mappings: number[][][]

  /**
   * Source map start offset. Lines before this are generated
   * (e.g. by require()) and are not mapped to anything.
   */
  startOffset: number
}

function createCachedMap(raw: RawSourceMap): SourceMap {
  // Parse VLQ-formatted line and column positions
  const lines = raw.mappings.split(';').map((line) => line.split(','))
  const decoded = lines.map((line) => line.map((col) => vlq.decode(col)))
  return { sources: raw.sources, mappings: decoded, startOffset: 0 }
}

function loadSourceMap(fileContents: string): SourceMap | undefined {
  const sourceMap = JSON.parse(fileContents)
  return createCachedMap(sourceMap)
}

/**
 * Cached source maps.
 */
const cachedMaps: Map<string, SourceMap> = new Map()

export function cacheSourceMap(file: string, content: string, startOffset: number): boolean {
  const map = loadSourceMap(content)

  if (map) {
    map.startOffset = startOffset
    cachedMaps.set(file, map)
    return true
  }

  return false
}

function mapLineInternal({ mappings, sources }: SourceMap, jsLine: number): SourceLine {
  // Advance through both files and lines in source map
  let sourceLine = 0
  let sourceFile = 0
  let result = 0
  for (let i = 0; i < mappings.length; i++) {
    const line = mappings[i]
    line.forEach((segment) => {
      sourceLine += segment[2] ?? 0
      sourceFile += segment[1] ?? 0
    })

    // Return TS file/line number when we reach given JS line number
    if (i + 1 === jsLine) {
      result = sourceLine + 1
      return {
        file: sources[sourceFile],
        line: result,
      }
    }
  }
  throw new Error(`source map failed for line ${jsLine}`)
}

export function mapLineToSource(file: string, line: number): SourceLine {
  const map = cachedMaps.get(`${file}`)
  if (map) {
    line -= map.startOffset // Apply start offset
    if (line <= 0) {
      return { file: file, line: line } // Not mapped line
    }

    const result = mapLineInternal(map, line)

    if (result.file.startsWith('webpack://test/')) {
      result.file = result.file.replace('webpack://test/', '')
    }

    if (result.file.startsWith('../')) {
      result.file = result.file.replace('../', './')
    }

    return result
  } else {
    // Mapping not found, return original JS file and line
    return { file, line }
  }
}

/**
 * Line in a file with source code.
 */
interface SourceLine {
  /**
   * File path, relative to directory where compiled JS file is.
   */
  file: string

  /**
   * Line number.
   */
  line: number
}
