"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmbedHandler {
    constructor(embeds) {
        this.page = 1;
        this.length = embeds.length;
        this.chunks = embeds;
    }
    render() {
        return { embeds: [this.chunks[this.page - 1]] };
    }
}
exports.default = EmbedHandler;
