"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
const npm_js_1 = __importDefault(require("#api/npm.js"));
exports.command = {
    name: 'npm',
    description: 'search for npm packages',
    args: true,
    argsHelp: ['...<query>'],
    examples: ['react', 'discord.js'],
    run({ client, msg, content }) {
        (0, npm_js_1.default)(content())
            .then((t) => (0, _libs_1.createEmbedPagination)(msg, t))
            .catch(() => msg.reply(client.config.emojis.sad + ' Any relevant search result not found!'));
    },
};
