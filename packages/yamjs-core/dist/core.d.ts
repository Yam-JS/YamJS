import { cacheSourceMap } from './sourceMap';
export declare const internal: unique symbol;
export declare const YamJSCore: {
    initialize: () => void;
    reload: () => Promise<void>;
    logError: (error: unknown, msg?: string) => void;
    catchAndLogUnhandledError: <R>(fn: () => R, msg: string) => R;
    cacheSourceMap: typeof cacheSourceMap;
    getDebugInfo: () => {
        yamJS: {
            coreVersion: string;
            pluginVersion: string;
            legacyVersion: string;
        };
        server: {
            players: string;
            plugins: string[];
            minecraftVersion: string;
            bukkitVersion: string;
            onlineMode: boolean;
        };
        java: {
            version: string;
            vendor: string;
            vendorUrl: string;
            home: string;
            command: string;
            timezone: string;
        };
        system: {
            os: {
                name: string;
                version: string;
                arch: string;
            };
            cpu: {
                cores: number;
            };
            memory: {
                free: number;
                max: string | number;
                total: number;
            };
            storage: {
                free: number;
                total: number;
                usable: number;
            };
        };
    };
    [internal]: {
        reloadHandler: {
            isReloading: () => boolean;
            reload: () => Promise<void>;
            register: (name: string, callback: import("./reload").CloseCallback) => import("./reload").CloseCallbackHandle;
            initialize: () => void;
        };
    };
};
