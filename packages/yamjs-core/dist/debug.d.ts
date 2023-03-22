export declare const getDebugInfo: () => {
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
