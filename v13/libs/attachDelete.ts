import { Message } from 'discord.js';

const emoji = '🗑️';
export async function attachDeletable(m: Message, id: string) {
  await m.react(emoji).catch(() => {});
  m.awaitReactions({
    time: 120000,
    dispose: true,
    filter(r, u) {
      return r.emoji.identifier == emoji && u.id == id;
    },
  }).then(() => {
    m.delete().catch(() => {});
    m.reactions.removeAll().catch(() => {});
  });
  return m;
}
