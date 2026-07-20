"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mInfo;
const util_1 = require("util");
function mInfo(m0) {
    let m = Object.assign({}, m0);
    const data = [];
    // content
    const content = m.content.length ? m.content : undefined;
    delete m.content;
    // embed
    const embeds = m.embeds.length
        ? JSON.stringify(m.embeds, null, '  ')
        : undefined;
    delete m.embeds;
    // author
    const author = (0, util_1.inspect)(m.author);
    delete m.author;
    data.push({
        title: 'Overview',
        description: 'Message Overview',
        text: (0, util_1.inspect)(m),
        emoji: '🤘',
        options: {
            split: { with: ',' },
            decoration: { lang: 'js', title: 'Messageinfo[Overview]' },
        },
    });
    data.push({
        title: 'Author',
        description: "Message's Author Info",
        text: author,
        emoji: '🕵️',
        options: {
            split: { with: ',' },
            decoration: { lang: 'js', title: 'Messageinfo[Author]' },
        },
    });
    if (embeds)
        data.push({
            title: 'Embeds',
            description: 'Message Embeds in JSON',
            text: embeds,
            emoji: '🏺',
            options: {
                split: { with: ',' },
                decoration: { lang: 'js', title: 'Messageinfo[Embeds]' },
            },
        });
    if (content)
        data.push({
            title: 'Content',
            description: 'Message Content',
            text: content,
            emoji: '🐏',
            options: { decoration: { title: 'Messageinfo[Content]' } },
        });
    return data;
}
