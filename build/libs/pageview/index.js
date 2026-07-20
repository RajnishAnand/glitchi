"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixedHandler = exports.EmbedHandler = exports.StringHandler = exports.Pagination = void 0;
exports.createStringPagination = createStringPagination;
exports.createEmbedPagination = createEmbedPagination;
exports.createObjectPagination = createObjectPagination;
const pagination_1 = require("./pagination");
Object.defineProperty(exports, "Pagination", { enumerable: true, get: function () { return pagination_1.Pagination; } });
const embed_1 = __importDefault(require("./handlers/embed"));
exports.EmbedHandler = embed_1.default;
const string_1 = __importDefault(require("./handlers/string"));
exports.StringHandler = string_1.default;
const mixed_1 = __importDefault(require("./handlers/mixed"));
exports.MixedHandler = mixed_1.default;
function createStringPagination(refMsg, text, options) {
    return new pagination_1.Pagination(refMsg, [{ provider: new string_1.default(text, options) }], options);
}
function createEmbedPagination(refMsg, embeds, options) {
    return new pagination_1.Pagination(refMsg, [{ provider: new embed_1.default(embeds) }], options);
}
function createObjectPagination(refMsg, data, options) {
    const views = data.map((e) => ({
        provider: 'text' in e
            ? new string_1.default(e.text, e.options)
            : 'embeds' in e
                ? new embed_1.default(e.embeds)
                : new mixed_1.default(e.payload),
        title: e.title,
        description: e.description,
        emoji: e.emoji,
    }));
    return new pagination_1.Pagination(refMsg, views, options);
}
