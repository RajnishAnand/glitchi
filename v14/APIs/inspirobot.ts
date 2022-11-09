import { EmbedBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
const url = 'https://inspirobot.me/api?generate=true';

export default async function () {
  const value = await fetch(url).then((r) => r.text());
  return {
    value,
    embedify() {
      return new EmbedBuilder({
        color: 0x2f3136,
        author: {
          name: 'InspiroBot.me',
          icon_url: 'https://inspirobot.me/website/images/favicon.png',
        },
        description: 'AI generated Inspiring Quotes.',
        url: 'https://inspirobot.me',
        image: { url: this.value },
        timestamp: new Date().toISOString(),
      });
    },
  };
}
