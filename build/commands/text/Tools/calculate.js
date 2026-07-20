"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const util_1 = require("util");
const mathjs_1 = require("mathjs");
const _libs_1 = require("#libs");
exports.command = {
    name: 'calculate',
    aliases: ['calc'],
    description: 'a calculator',
    args: true,
    argsHelp: ['<...text>'],
    async run({ msg, content }) {
        const stopwatch = new _libs_1.Stopwatch();
        try {
            stopwatch.start();
            const txt = (0, mathjs_1.compile)(content()).evaluate();
            stopwatch.stop();
            (0, _libs_1.createStringPagination)(msg, (0, util_1.inspect)(txt, { depth: 10 }), {
                split: { with: ',' },
                decoration: {
                    lang: 'js',
                    title: 'MATH.JS',
                    secondaryTitle: `⏱ ${stopwatch.elapsed}s`,
                },
            });
        }
        catch (err) {
            (0, _libs_1.createStringPagination)(msg, err.message ?? ' ', {
                decoration: {
                    lang: 'js',
                    title: 'MATH.JS[ERROR]',
                },
            });
        }
    },
};
