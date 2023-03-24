/// <reference types="@graal-types/paper-1.19/org_bukkit" />
/// <reference types="@graal-types/paper-1.18/org_bukkit" />
import { cacheSourceMap } from './sourceMap';
export declare const internal: unique symbol;
/**
 * This is currently unstable and subject to change.
 */
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
            instance: any;
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
    registerEvent: import("./registerEvent").RegisterEventType<any>;
    createEventListener: () => import("org.bukkit.event").Listener;
    manager: import("org.bukkit.plugin").PluginManager;
    plugin: import("org.bukkit.plugin").Plugin;
    server: import("org.bukkit").Server;
    /**
     * This is used internally by YamJS to store internal data.
     * This is not recommended for use by plugins.
     *
     * Use at your own risk.
     *
     * @internal
     */
    [internal]: {
        reloadHandler: {
            isReloading: () => boolean;
            reload: () => Promise<void>;
            register: (name: string, callback: import("./reload").CloseCallback) => import("./reload").CloseCallbackHandle;
            initialize: () => void;
        };
    };
};
