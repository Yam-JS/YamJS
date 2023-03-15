/** Converts array-like objects or iterators into arrays. */
export declare function array(object: any): any[];
/** Internal value used to represent circular object references in formatted output. */
export declare const circular: unique symbol;
/** Formatting tools for script feedback. */
export declare const format: {
    /** Reformats complex error messages into layman-friendly ones. */
    error(error: any): string;
    /** A pretty-printer for JavaScript objects. */
    output(object: any, condense?: boolean): string;
};
