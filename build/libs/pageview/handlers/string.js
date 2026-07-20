"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringHandler {
    constructor(text, options) {
        this.page = 1;
        this.length = 1;
        this.chunks = [' '];
        this.update(text, options);
    }
    update(text, options) {
        const chunks = this.intoChunks(text, options?.split);
        this.length = chunks.length;
        this.chunks = this.decorate(chunks, options?.decoration);
        this.page = Math.min(this.page, this.length) || 1; // fix: clamp after resize
    }
    render() {
        return { content: this.chunks[this.page - 1] };
    }
    // Decoration : codeblock,title,timestamp .....
    decorate(texts, options) {
        return texts.map((str) => {
            let s = str + '\n';
            if (options?.codeblock)
                s = '```' + (options?.lang || '') + '\n' + str.replaceAll('`', '\\`') + ' ```';
            if (this.length > 1)
                s += `\` ⠪ Page : ${texts.indexOf(str) + 1}/${this.length} \` `;
            if (options?.title)
                s += `\`‣ ${options.title} \` `;
            if (options?.secondaryTitle)
                s += `\`‣ ${options.secondaryTitle} \` `;
            if (options?.timestamp)
                s += ` <t:${Math.floor(+options.timestamp / 1000)}:R>  `;
            return s;
        });
    }
    // long string into chunks
    intoChunks(text, split = {}) {
        split.min ??= 800;
        split.max ??= 850;
        split.with ??= ' ';
        let lastSplitIndex = 0;
        let lastSplitLength = split.min;
        const chunks = [];
        o: for (let i = 0; lastSplitIndex < text.length; i += lastSplitLength) {
            for (let j = split.min; j < split.max; j++) {
                if (text[lastSplitIndex + j - 1] == split.with) {
                    chunks.push(text.substring(lastSplitIndex, lastSplitIndex + j));
                    lastSplitLength = j;
                    lastSplitIndex += j;
                    continue o;
                }
            }
            chunks.push(text.substring(lastSplitIndex, lastSplitIndex + split.min + 1));
            lastSplitIndex += split.min + 1;
            lastSplitLength = split.min;
        }
        return chunks;
    }
}
exports.default = StringHandler;
