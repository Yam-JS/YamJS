import { Opaque } from 'type-fest';
type TickerTask = () => void;
type TaskId = Opaque<number, 'TaskId'>;
export declare const yamTickerTasks: {
    add: (fn: TickerTask, baseTick: number, options?: {
        reset?: boolean;
        nextId?: number;
    }) => TaskId;
    run: (tick: number) => void;
    remove: (id: number) => void;
    initialize: () => void;
};
export {};
