import { Message } from 'discord.js';

const emoji = '🗑️';
export async function attachDeletable(m: Message, userId: string) {
  await m.react(emoji).catch(() => {});
  m.awaitReactions({
    time: 120000,
    max: 1,
    dispose: true,
    filter(r, u) {
      return r.emoji.toString() == emoji && u.id == userId;
    },
  })
    .then((c) => {
      m.reactions.removeAll().catch(() => {});
      if (c.size == 0) return;
      m.delete().catch(() => {});
    })
    .catch(() => {});
  return m;
}
