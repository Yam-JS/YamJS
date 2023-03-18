"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadHandler = void 0;
const legacy_1 = require("./legacy");
const createReloadHandler = () => {
    const callbacks = {};
    let isReloading = false;
    let nextId = 0;
    const executeReload = async () => {
        (0, legacy_1.reload)();
    };
    const executeRegisteredCallbacks = async () => {
        const snapshot = { ...callbacks };
        for (const i in snapshot) {
            console.log(`Closing ${callbacks[i].name}`);
            const callback = callbacks[i];
            try {
                await callback.fn?.();
            }
            catch (err) {
                console.error(err);
            }
            delete callbacks[i];
        }
    };
    return {
        isReloading: () => isReloading,
        reload: async () => {
            console.log(`Reloading`);
            if (isReloading) {
                console.log('Force reloading');
                executeReload();
                return;
            }
            isReloading = true;
            await executeRegisteredCallbacks();
            (0, legacy_1.reload)();
        },
        register: (name, callback) => {
            const id = nextId++;
            callbacks[id] = { name, fn: callback };
            return {
                unregister: () => delete callbacks[id],
            };
        },
        initialize: () => {
            Yam.instance.setOnCloseFn(async () => {
                await executeRegisteredCallbacks();
            });
        },
    };
};
exports.reloadHandler = createReloadHandler();
