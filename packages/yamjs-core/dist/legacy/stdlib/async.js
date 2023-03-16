"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
index_1.desync.provide(async (info) => {
    return await index_1.desync.shift(() => {
        try {
            let output;
            switch (info.operation) {
                case 'fetch.read':
                    output = (0, index_1.fetch)(info.link).read();
                    break;
                case 'file.read':
                    output = (0, index_1.file)(info.path).read() || '';
                    break;
                case 'file.write':
                    (0, index_1.file)(info.path).write(info.content);
                    break;
            }
            (0, index_1.push)(index_1.context.destroy);
            return output;
        }
        catch (error) {
            (0, index_1.push)(index_1.context.destroy);
            throw error;
        }
    });
});
