import { BukkitTask } from 'org.bukkit.scheduler';
interface TickContext {
    tick: number;
    task: BukkitTask | undefined;
    isActive: boolean;
    tickFns: ((tick: number) => void)[];
}
declare const Context: unique symbol;
export declare const yamTicker: {
    [Context]: TickContext;
    start: () => void;
    stop: () => Promise<void>;
    getTick: () => number;
    registerTickFn: (fn: (tick: number) => void) => void;
};
export {};
