/**
 * Line in a file with source code.
 */
interface SourceLine {
    /**
     * File path, relative to directory where compiled JS file is.
     */
    file: string;
    /**
     * Line number.
     */
    line: number;
}
export declare function cacheSourceMap(file: string, content: string, startOffset: number): boolean;
export declare function mapLineToSource(file: string, line: number): SourceLine;
export {};
