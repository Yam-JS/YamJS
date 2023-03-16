"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamTicker = void 0;
const util_1 = require("./util");
const Context = Symbol('TickContext');
const nextTick = () => {
    const ctx = exports.yamTicker[Context];
    if (!ctx.isActive)
        return;
    for (const fn of ctx.tickFns) {
        fn(ctx.tick);
    }
    if (ctx.tick % 20 === 0) {
        (0, util_1.logVerbose)('Tick', ctx.tick);
    }
    ctx.tick += 1;
};
const createTicker = () => {
    const ctx = {
        tick: 0,
        task: undefined,
        isActive: false,
        tickFns: [],
    };
    const start = () => {
        ctx.isActive = true;
        Yam.registerTickFn(nextTick);
    };
    const stop = async () => {
        ctx.isActive = false;
        if (ctx.task)
            ctx.task.cancel();
        return;
    };
    return {
        [Context]: ctx,
        start,
        stop,
        getTick: () => ctx.tick,
        registerTickFn: (fn) => {
            ctx.tickFns.push(fn);
        },
    };
};
exports.yamTicker = createTicker();
