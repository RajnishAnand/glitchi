import fetch from 'node-fetch';
import Filter from 'bad-words';
import { dictionaryapiResponse } from './types';
import { EmbedBuilder } from 'discord.js';

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const filter = new Filter({ placeHolder: '\\*' });

export function dictionary(word: string) {
  return fetch(url + encodeURIComponent(word))
    .then((r) => r.json() as Promise<dictionaryapiResponse>)
    .then((raw) => ({
      raw,
      embed() {
        if ('title' in raw) {
          return [
            new EmbedBuilder({
              author: {
                name: 'Dictionary',
                icon_url:
                  'https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Dictionary-icon.png',
              },
              title: 'Word: ' + word,
              description:
                raw.title + (raw.title == 'No Definitions Found')
                  ? '\n\nThe word you were looking is not avaliable in dictionary. Perhaps try serching on web.'
                  : '',
              color: 3092790,
            }),
          ];
        }
        return raw.map(
          (e) =>
            new EmbedBuilder({
              author: {
                name: 'Dictionary',
                icon_url:
                  'https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Dictionary-icon.png',
              },
              color: 3092790,
              title: `word: ${e.word} ${e.phonetic ?? ''}`,
              url: e.sourceUrls[0],
              fields: e.meanings
                .map((m) => ({
                  name: `${m.partOfSpeech} :`,
                  value: filter.clean(
                    `​ ⤍ ` +
                      truncate(
                        m.definitions.map((d) => d.definition).join('\n ⤍ '),
                      ) +
                      '\n​',
                  ),
                }))
                .slice(0, 24),
            }),
        );
      },
    }));
}

function truncate(str: string) {
  return str.length > 1000 ? str.slice(0, 999) + '...' : str;
}
