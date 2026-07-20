"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
exports.command = {
    name: 'owoify',
    description: 'convert to text to owoLang',
    aliases: ['owo'],
    args: true,
    examples: ['hello'],
    run({ client, msg, commandName }) {
        msg.reply((0, _libs_1.owoify)(msg.cleanContent
            .slice(client.config.prefix.length)
            .trim()
            .replace(commandName + ' ', '')));
    },
};
