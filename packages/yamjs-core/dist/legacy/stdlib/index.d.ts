type classes = any;
type jiFile = any;
type jiInputStream = any;
type ogpContext = any;
type juLinkedList = any;
/** A serializable object. */
export type basic = {
    [x in string]: basic;
} | basic[] | string | number | boolean | null | undefined | void;
/** A set of listeners attached to an event. */
export type cascade = Set<((event: any) => void) | {
    script: (event: any) => void;
    priority: priority;
}>;
/** A pending task. */
export type future = {
    tick: number;
    args: any[];
    script: Function;
};
/** A valid event name. */
export type events = keyof classes & `${string}Event`;
/** A Yam context instance. */
export type instance = {
    context: ogpContext;
    hooks: {
        list: juLinkedList<Function>;
        release(): void;
    };
    messages: juLinkedList<{
        channel: string;
        content: string;
    }>;
    meta: string;
    root: string;
    tasks: {
        list: juLinkedList<Function>;
        release(): void;
    };
    close(): void;
    destroy(): void;
    execute(): void;
    open(): void;
    tick(): void;
};
/** A valid event priority. */
export type priority = 'HIGH' | 'HIGHEST' | 'LOW' | 'LOWEST' | 'MONITOR' | 'NORMAL';
/** File system utilities for a specific path. */
export type record = {
    /** Returns an array of modifiers for the contents of the folder (if any) at the current path. */
    readonly children: record[];
    /** Creates a folder at the current path if no file or folder already exists there. */
    directory(): record;
    /** Creates a file at the current path if no file or folder already exists there. */
    entry(): record;
    /** Whether a file or folder exists at the current path or not. */
    readonly exists: boolean;
    /** Joins the current path and the given sub-path, and returns a new modifier for it. */
    file(...sub: string[]): record;
    /** Starting from the current path, removes parent folders upstream until a parent folder is non-empty. */
    flush(): record;
    /** The java file for the current path. */
    io: jiFile;
    /** Synchronously parses the JSON content (if any) of the file at the current path. */
    json(async?: false): any;
    /** Parses the JSON content (if any) of the file at the current path. */
    json(async: true): Promise<any>;
    /** The name of the current path. */
    readonly name: string;
    /** The current path. */
    readonly path: string;
    /** The record for the parent folder of the current path. */
    readonly parent: record;
    /** Synchronously returns the content (if any) of the file at the current path. */
    read(async?: false): string;
    /** Returns the content (if any) of the file at the current path. */
    read(async: true): Promise<string>;
    /** Removes and flushes the file or folder (if any) at the current path. */
    remove(): record;
    /** Whether the current path represents a folder, a file, or none of the above. */
    readonly type: 'folder' | 'file' | 'none';
    /** Synchronously writes the given content to the file (if any) at the current path. */
    write(content: string, async?: false): record;
    /** Writes the given content to the file (if any) at the current path. */
    write(content: string, async: true): Promise<record>;
};
/** A web response. */
export type response = {
    /** Synchronously parses the JSON content (if any) of the response. */
    json(async?: false): any;
    /** Parses the JSON content (if any) of the response. */
    json(async: true): Promise<any>;
    /** Synchronously returns the content (if any) of the response. */
    read(async?: false): string;
    /** Returns the content (if any) of the response. */
    read(async: true): Promise<string>;
    /** Returns the response stream. */
    stream(): jiInputStream;
};
/** A session container for this module. */
export declare const session: {
    data: Map<string, any>;
    event: Map<`${string}Event`, cascade>;
    load: Map<string, any>;
    poly: {
        index: number;
        list: Map<number, future>;
    };
    task: {
        list: Set<future>;
        tick: number;
    };
    type: Map<string | number | symbol, any>;
};
/** Imports the specified type from java. */
export declare function type<X extends keyof classes>(name: X): classes[X];
/** A system which simplifies asynchronous cross-context code execution. */
export declare const desync: {
    /** Provides the result to a desync request within an auxilliary file. If this method is called while not within a desync-compatible context, it will fail. */
    provide(provider: (data: basic) => basic | Promise<basic>): Promise<void>;
    /** Sends a desync request to another file. If said file has a valid desync provider, that provider will be triggered and a response will be sent back when ready. */
    request(path: string | record | jiFile, data?: basic): Promise<basic>;
    /** Runs a task off the main server thread. */
    shift<X>(script: (...args: any[]) => X | Promise<X>): Promise<X>;
};
/** It's even more complicated. */
export declare function chain<A, B extends (input: A, loop: (input: A) => C) => any, C extends ReturnType<B>>(input: A, handler: B): C;
/** Registers a custom command to the server. */
export declare function command(options: {
    name: string;
    message?: string;
    aliases?: string[];
    execute?: (sender: any, ...args: string[]) => void;
    namespace?: string;
    permission?: string;
    tabComplete?: (sender: any, ...args: string[]) => string[];
}): void;
/**
 * A simple task scheduler.
 * @deprecated
 */
export declare const task: {
    /** Cancels a previously scheduled task. */
    cancel(handle: future): void;
    /** Schedules a task to run infinitely at a set interval. */
    interval(script: Function, period?: number, ...args: any[]): {
        tick: number;
        args: any[];
        script: (...args: any[]) => void;
    };
    /** Schedules a task to run after a set timeout. */
    timeout(script: Function, period?: number, ...args: any[]): {
        tick: number;
        args: any[];
        script: (...args: any[]) => void;
    };
};
export declare const context: {
    /** Creates a new context and returns its instance. If `type` is file, `content` refers to a JS file path relative to the JS root folder. If `type` is script, `content` refers to a piece of JS code. */
    create<X extends "file" | "script">(type: X, content: string, meta?: string): {
        file: instance & {
            main: string;
        };
        script: instance & {
            code: string;
        };
    }[X];
    /** Destroys the currently running context. */
    destroy(): void;
    emit(channel: string, message: string): void;
    meta: string;
    off(channel: string, listener: (data: string) => void): void;
    on: {
        (channel: string): Promise<string>;
        (channel: string, listener: (data: string) => void): any;
    };
    swap(): void;
};
/** Stores data on a per-path basis. */
export declare function data(path: string, ...more: string[]): any;
/** The environment that this module is currently running in. */
export declare const env: {
    content: {
        EventPriority: any;
        instance: any;
        manager: any;
        plugin: any;
        Runnable: any;
        server: any;
        ArgumentType?: undefined;
        Command?: undefined;
        extension?: undefined;
        node?: undefined;
        registry?: undefined;
        SuggestionEntry?: undefined;
    };
    name: string;
} | {
    content: {
        ArgumentType: any;
        Command: any;
        extension: any;
        manager: any;
        node: any;
        registry: any;
        server: any;
        SuggestionEntry: any;
        EventPriority?: undefined;
        instance?: undefined;
        plugin?: undefined;
        Runnable?: undefined;
    };
    name: string;
} | {
    name: string;
    content: {
        EventPriority?: undefined;
        instance?: undefined;
        manager?: undefined;
        plugin?: undefined;
        Runnable?: undefined;
        server?: undefined;
        ArgumentType?: undefined;
        Command?: undefined;
        extension?: undefined;
        node?: undefined;
        registry?: undefined;
        SuggestionEntry?: undefined;
    };
};
/** Attaches one or more listeners to a server event. */
export declare function event<X extends events>(name: X, ...listeners: (((event: InstanceType<classes[X]>) => void) | {
    script: (event: InstanceType<classes[X]>) => void;
    priority: priority;
})[]): void;
/** Sends a GET request to the given URL. */
export declare function fetch(link: string): response;
/** A utility wrapper for paths and files. */
export declare function file(path: string | record | jiFile, ...more: string[]): record;
/** Imports classes from external files.123 */
export declare function load<T>(path: string | record | jiFile, name: string): T;
/** Runs a script on the next tick. */
export declare function push(script: Function): void;
/** Tools for using regex patterns. */
export declare const regex: {
    test(input: string, expression: string): any;
    replace(input: string, expression: string, replacement: string): any;
};
/** Reloads the JS environment. */
export declare function reload(): void;
/** The root folder of the environment. */
export declare const root: record;
/** Recursively removes or replaces the circular references in an object. */
export declare function simplify(object: any, placeholder?: any, objects?: Set<any>): any;
export declare function sync<X>(script: (...args: any[]) => Promise<X>): Promise<X>;
export {};
