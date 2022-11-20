import { EmbedBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
const url = 'https://developer.mozilla.org/api/v1/search?q=';

export default async function mdn(query: string) {
  const resp = await fetch(url + encodeURI(query)).then((r) => r.json());
  if (!resp.documents.length)
    throw Error('Any relevant search result not found!');

  const data: mdnResponse[] = resp.documents.map((r: mdnAPIResponse) => {
    return {
      value: {
        title: r.title,
        summary: r.summary,
        mdn_url: 'https://developer.mozilla.org' + r.mdn_url,
      },
      embedify() {
        return new EmbedBuilder({
          author: {
            name: 'MDN Web Docs_',
            icon_url:
              'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
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

interface mdnResponse {
  value: mdnAPIResponse;
  embedify: () => EmbedBuilder;
}

interface mdnAPIResponse {
  mdn_url: string;
  summary: string;
  title: string;
}
