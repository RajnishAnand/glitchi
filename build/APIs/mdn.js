"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mdn;
const discord_js_1 = require("discord.js");
const url = 'https://developer.mozilla.org/api/v1/search?q=';
async function mdn(query) {
    const resp = await fetch(url + encodeURI(query)).then((r) => r.json());
    if (!resp.documents.length)
        throw Error('Any relevant search result not found!');
    const data = resp.documents.map((r) => {
        return {
            value: {
                title: r.title,
                summary: r.summary,
                mdn_url: 'https://developer.mozilla.org' + r.mdn_url,
            },
            embedify() {
                return new discord_js_1.EmbedBuilder({
                    author: {
                        name: 'MDN Web Docs_',
                        icon_url: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
                    },
                    title: this.value.title,
                    url: this.value.mdn_url,
                    color: 0x15141a,
                    description: this.value.summary,
                    timestamp: new Date().toISOString(),
                });
            },
        };
    });
    return data;
}
