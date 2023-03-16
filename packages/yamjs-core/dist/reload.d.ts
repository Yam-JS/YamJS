export type CloseCallback = () => any;
export interface CloseCallbackHandle {
    unregister(): void;
}
export declare const yamReloadHandler: {
    isReloading: () => boolean;
    reload: () => Promise<void>;
    register: (name: string, callback: CloseCallback) => CloseCallbackHandle;
    initialize: () => void;
};
