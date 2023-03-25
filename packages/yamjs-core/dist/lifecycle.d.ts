type Hook = {
    name?: string;
    hook: HookCallback;
    /**
     * Allows to control the order of execution.
     * Lower number means earlier execution.
     * Higher number means later execution.
     *
     * Default is 3.
     */
    priority?: 1 | 2 | 3 | 4 | 5;
};
export type HookCallback = () => void;
type HookUnref = () => void;
type LifecycleTypes = 'onDisable' | 'onEnable';
export declare const __INTERNAL_LIFECYCLE: unique symbol;
export declare const lifecycle: {
    [__INTERNAL_LIFECYCLE]: {
        executeHooks: (type: LifecycleTypes) => Promise<void>;
    };
    reload: () => Promise<void>;
    register: (name: LifecycleTypes, hook: Hook) => HookUnref;
};
export {};
