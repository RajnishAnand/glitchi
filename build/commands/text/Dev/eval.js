"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const util_1 = __importDefault(require("util"));
const _libs_1 = require("#libs");
exports.command = {
    name: 'eval',
    aliases: ['ev', '>'],
    description: 'Evaluate',
    ownerOnly: true,
    args: true,
    argsHelp: ['...<code>'],
    run({ client, msg, content, ref }) {
        const stopwatch = new _libs_1.Stopwatch();
        try {
            if (msg.author.id ===
                msg.client.guilds.cache.get(client.config.guildId)?.ownerId) {
                const client = msg.client;
                const fetchRef = ref;
                const send = (text, bool = false) => {
                    if (bool)
                        (0, _libs_1.createStringPagination)(msg, text);
                    else
                        (0, _libs_1.createStringPagination)(msg, debug(text), {
                            decoration: {
                                codeblock: true,
                                lang: 'js',
                                title: 'JS-OUTPUT',
                                secondaryTitle: `⏱ ${(stopwatch.stop(), stopwatch.elapsed)}s`,
                            },
                            split: { with: ',' },
                        });
                    return '<pagination>';
                };
                stopwatch.start();
                send(eval(content()));
            }
            else {
                msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
            }
        }
        catch (err) {
            msg.channel.send('```\n' + err.message + '```');
        }
    },
};
//To replace '<' & '`' character
function debug(evaled) {
    try {
        if (typeof evaled === 'string') {
            evaled = evaled.replace(/</g, '<​').replace(/```/g, '`​``');
        }
        return util_1.default.inspect(evaled);
    }
    catch (err) {
        return err.message;
    }
}
