export declare const logError: (error: unknown, msg?: string) => void;
export declare const catchAndLogUnhandledError: <R>(fn: () => R, msg: string) => R;
export declare const createCatchAndLogUnhandledErrorHandler: <P extends any[], R>(fn: (...arg: P) => R, msg: string) => (...args: P) => R;
