"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MixedHandler {
    constructor(pages) {
        this.page = 1;
        this.length = pages.length;
        this.chunks = pages;
    }
    render() {
        return this.chunks[this.page - 1];
    }
}
exports.default = MixedHandler;
