export type CloseCallback = () => any;
export interface CloseCallbackHandle {
    unregister(): void;
}
export declare const reloadHandler: {
    isReloading: () => boolean;
    reload: () => Promise<void>;
    register: (name: string, callback: CloseCallback) => CloseCallbackHandle;
    initialize: () => void;
};
