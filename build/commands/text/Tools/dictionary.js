"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _dictionary_1 = require("#api/@dictionary");
const _libs_1 = require("#libs");
exports.command = {
    name: 'dictionary',
    aliases: ['whats', 'define', 'word'],
    description: 'get defination of a word',
    args: true,
    argsHelp: ['<word>'],
    examples: ['soul', 'endanger', 'word'],
    async run({ msg, content }) {
        (0, _dictionary_1.dictionary)(content())
            .then((response) => { (0, _libs_1.createEmbedPagination)(msg, response.embed()); })
            .catch(() => msg.reply('ERR: Failed to fetch requested defination.'));
    },
};
