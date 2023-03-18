import { command, load } from './legacy';
export declare const YamJSCore: {
    createCommand: typeof command;
    initialize: () => void;
    loadJar: typeof load;
    reload: () => Promise<void>;
    logError: (error: unknown, msg?: string) => void;
    catchAndLogUnhandledError: <R>(fn: () => R, msg: string) => R;
};
