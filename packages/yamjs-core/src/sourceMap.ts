/*
 * MIT License
 *
 * Copyright (c) 2020 https://github.com/Dysfold/craftjs/blob/17a5b811c1ed22a1e55647a89d5e360c98f3d958/LICENSE.md
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
