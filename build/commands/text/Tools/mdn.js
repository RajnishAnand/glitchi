"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
const mdn_js_1 = __importDefault(require("#api/mdn.js"));
exports.command = {
    name: 'mdn',
    description: 'search from mdn',
    argsHelp: ['...<query>'],
    args: true,
    examples: ['AJAX', 'fetch'],
    run({ client, msg, content }) {
        (0, mdn_js_1.default)(content())
            .then((t) => (0, _libs_1.createEmbedPagination)(msg, t.map((k) => k.embedify())))
            .catch(() => msg.reply(client.config.emojis.sad + ' Any relevant search result not found!'));
    },
};
