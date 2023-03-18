"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickerTasks = void 0;
const ticker_1 = require("./ticker");
const isTick = (tick) => true;
const isTaskId = (id) => true;
const tick = (tick) => tick;
const taskId = (id) => id;
const createTickerTasks = () => {
    const context = {
        nextId: 0,
    };
    const taskIdMap = new Map();
    const remove = (id) => {
        if (!isTaskId(id))
            return;
        taskIdMap.delete(id);
    };
    const add = (fn, baseTick, options) => {
        if (!isTick(baseTick))
            return;
        const id = taskId(options?.nextId ?? context.nextId++);
        const targetTick = tick(ticker_1.ticker.getTick() + Math.max(baseTick, 1));
        // Handle TaskIdMap
        taskIdMap.set(id, {
            baseTick,
            tick: targetTick,
            fn,
            reset: options?.reset || false,
            id,
        });
        return id;
    };
    const runTask = (task) => {
        taskIdMap.delete(task.id);
        task.fn();
        if (task.reset) {
            add(task.fn, task.baseTick, { reset: task.reset, nextId: task.id });
        }
    };
    const run = (tick) => {
        if (!isTick(tick))
            return;
        for (const [, task] of taskIdMap) {
            if (tick >= task.tick) {
                runTask(task);
            }
        }
    };
    return {
        add,
        run,
        remove,
        initialize: () => {
            ticker_1.ticker.registerTickFn((tick) => run(tick));
        },
    };
};
exports.tickerTasks = createTickerTasks();
