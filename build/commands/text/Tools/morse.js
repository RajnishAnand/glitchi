"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
const morse_node_1 = __importDefault(require("morse-node"));
const morse = morse_node_1.default.create('ITU');
exports.command = {
    name: 'morse',
    description: 'a morse convertor',
    args: true,
    argsHelp: ['?<encode||decode>', '...<text>'],
    examples: ['encode', 'decode'],
    async run({ msg, args, content, ref }) {
        let text;
        if (args[0].toLowerCase() == 'en' ||
            args[0].toLowerCase() == 'de' ||
            args[0].toLowerCase() == 'decode' ||
            args[0].toLowerCase() == 'encode')
            text = content().replace(args[0].toLowerCase(), '');
        else
            text = content();
        if (text == '')
            text = (await ref().then((m) => m?.content)) ?? '';
        if (text == '')
            return msg
                .reply('You probably forgot to add text you want to encode/decode.')
                .then((m) => (0, _libs_1.attachDeletable)(m, msg.author.id));
        if (args[0].toLowerCase() == 'decode' || args[0].toLowerCase() == 'de') {
            text = text.replaceAll('\n', '\n ').replaceAll(/  +/g, ' / ');
            (0, _libs_1.createStringPagination)(msg, morse.decode(text));
        }
        else
            (0, _libs_1.createStringPagination)(msg, morse.encode(text), {
                decoration: { lang: 'morse', title: 'MORSE [ITU Standard]' },
            });
    },
};
