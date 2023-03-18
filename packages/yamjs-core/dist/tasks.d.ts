import { Opaque } from 'type-fest';
type TickerTask = () => void;
type TaskId = Opaque<number, 'TaskId'>;
export declare const tickerTasks: {
    add: (fn: TickerTask, baseTick: number, options?: {
        /**
         * Reset the task after it has been run
         *
         * @default false
         */
        reset?: boolean;
        nextId?: number;
    }) => TaskId;
    run: (tick: number) => void;
    remove: (id: number) => void;
    initialize: () => void;
};
export {};
