"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachDeletable = attachDeletable;
const emoji = '🗑️';
async function attachDeletable(m, userId) {
    await m.react(emoji).catch(() => { });
    m.awaitReactions({
        time: 120000,
        max: 1,
        dispose: true,
        filter(r, u) {
            return r.emoji.toString() == emoji && u.id == userId;
        },
    })
        .then((c) => {
        m.reactions.removeAll().catch(() => { });
        if (c.size == 0)
            return;
        m.delete().catch(() => { });
    })
        .catch(() => { });
    return m;
}
