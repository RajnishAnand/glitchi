import { MessageEmbed } from 'discord.js';
import { PacResponse } from './types';

const pacUrl = 'https://archlinux.org/packages/search/json/';

export async function pacman(name: string) {
  const data: PacResponse = await fetch(
    `${pacUrl}?name=${encodeURI(name)}`,
  ).then((r) => r.json());
  if (!data.results.length) throw new Error('No results Found!');

  const result = data.results[0];
  return {
    ...result,
    get embedidy() {
      return new MessageEmbed({
        title: `pacman `,
      });
    },
  };
}
