/// <reference types="@graal-types/paper-1.18/org_bukkit" />
/// <reference types="@graal-types/paper-1.19/org_bukkit" />
import * as base from '../stdlib';
export * from '../stdlib';
export declare const stdlib: typeof base & {
    manager: any;
    plugin: import("org.bukkit.plugin").Plugin;
    server: any;
};
export default stdlib;
