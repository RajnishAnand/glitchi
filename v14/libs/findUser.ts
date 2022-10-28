import { Guild } from 'discord.js';

export function findUser(g: Guild, query: string) {
  return g.members
    .search({
      query,
      cache: false,
      limit: 1,
    })
    .then((m) => m.first());
}
