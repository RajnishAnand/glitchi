import { EmbedBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import { RandomFilterOptions, QuoteResponse, ErrorResponse } from './types';

/** API URL */
const URL = 'https://api.quotable.io';

/** Returns a random Quote */
export async function randomQuote(filters?: RandomFilterOptions) {
  let options: string | undefined;

  // filter options
  if (filters)
    options = `?${
      filters.author ? `author=${encodeURI(filters.author)}&` : ''
    }${filters.maxLength ? `maxLength=${filters.maxLength}&` : ''}${
      filters.minLength ? `minLength=${filters.minLength}&` : ''
    }${filters.tags ? `tags=${encodeURI(filters.tags)}` : ''}`;

  const value: QuoteResponse | ErrorResponse = await fetch(
    `${URL}/random/${options ?? ''}`,
  ).then((r) => r.json());
  if (!('_id' in value)) throw new Error(value.statusMessage);
  return {
    value,
    embedify() {
      return decorate(this.value);
    },
  };
}

/** Returns a Quote with id id found*/
export async function quoteById(id: string) {
  const value: QuoteResponse | ErrorResponse = await fetch(
    `${URL}/quotes/${id}`,
  ).then((r) => r.json());
  if (!('_id' in value)) throw new Error(value.statusMessage);

  return {
    value,
    embedify() {
      return decorate(this.value);
    },
  };
}

/** decorates a QuoteResponse or ErrorResponse into an embed*/
function decorate(d: QuoteResponse): EmbedBuilder {
  return new EmbedBuilder({
    color: 0xfcc300,
    author: {
      name: 'Quotable: ',
      url: URL,
    },
    description: `> ❝ **${d.content}** ❞
    ✐ ${d.author}`,
    fields: [
      {
        name: 'Tags :',
        value: `> ${d.tags}`,
        inline: false,
      },
    ],
    footer: {
      text: `id: ${d._id}`,
    },
  });
}
