"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const child_process_1 = __importDefault(require("child_process"));
const util_1 = __importDefault(require("util"));
const _libs_1 = require("#libs");
exports.command = {
    name: 'exec',
    description: 'execute command directly to bash',
    aliases: ['ex', '$'],
    args: true,
    argsHelp: ['...<code>'],
    ownerOnly: true,
    run({ client, msg, content }) {
        if (!(msg.author.id === client.config.ownerId))
            return;
        child_process_1.default.exec(content(), (...d) => {
            let tx = d[0] ? util_1.default.inspect(d[0]) : d[1] ? d[1] : d[2];
            (0, _libs_1.createStringPagination)(msg, tx, {
                decoration: { lang: 'bash', codeblock: true, title: 'BASH-OUTPUT' },
            });
        });
    },
};
