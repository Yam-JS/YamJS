import { cacheSourceMap } from './sourceMap';
export declare const YamJSCore: {
    initialize: () => void;
    reload: () => Promise<void>;
    logError: (error: unknown, msg?: string) => void;
    catchAndLogUnhandledError: <R>(fn: () => R, msg: string) => R;
    cacheSourceMap: typeof cacheSourceMap;
};
