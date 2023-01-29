import fetch from 'node-fetch';
import type { AbortSignal } from 'node-fetch/externals';
import { inspect } from 'util';
import { parse } from 'content-type';
import { ask, select, stringPagination } from '#libs';
import { CBParser } from 'cbparser';
import { TextCommand, TextCommandOptions } from 'client/interface';

export const command: TextCommand = {
  name: 'fetch',
  description: 'To fetch any URL .',
  argsHelp: ['<url>', '?<--get||--post||--headers>', '?<post_text> <?headers>'],
  args: true,
  examples: ['http://example.com/'],
  run,
};

const types = [
  'text/plain',
  'application/xml',
  'application/json',
  'application/x-www-form-urlencoded',
];

async function run({ msg, args, content }: TextCommandOptions) {
  let response = '';
  let headers: { [index: string]: string } = {};
  let title: string | undefined;
  if (!args[1] || !args[1].startsWith('-')) args.splice(1, 0, '-g');

  if (args[1].toLowerCase() == '-g' || args[1].toLowerCase() == '--get') {
    let [head] = CBParser(content().replace(/[­ ]/g, ''));
    if (head) {
      try {
        headers = JSON.parse(head.code);
      } catch (err: any) {
        return msg.reply('Error while parsing Headers:' + err.message);
      }
    }
    [response, title] = await GET(args[0], headers);
  } else if (
    args[1].toLowerCase() == '-p' ||
    args[1].toLowerCase() == '--post'
  ) {
    let [{ code, lang }, head] = CBParser(content().replace(/[­ ]/g, ''));
    //post body requirement
    if (!code) {
      return msg.reply(
        'Please also include body/text you wanna POST in a codeBlock !',
      );
    }
    // headers
    if (head) {
      try {
        headers = JSON.parse(head.code);
      } catch (err: any) {
        return msg.reply('Error while parsing Headers:' + err.message);
      }
    } else if (lang == 'json') {
      headers = { 'Content-Type': 'application/json' };
      try {
        JSON.parse(code);
      } catch (err: any) {
        return msg.reply(err.message);
      }
    } else if (!lang || !types.includes(lang)) {
      try {
        headers = {
          'Content-Type': await select(msg, {
            content: 'Please pick a supported content type:',
            title: 'Select content-type',
            options: [
              ...types.map((z) => {
                return {
                  label: z,
                  description: `set request body format as ${z}`,
                  value: z,
                };
              }),
              {
                label: 'Other',
                description: 'custom content type',
                value: 'none',
              },
            ],
          }),
        };
        if (headers['Content-Type'] == 'none') {
          const ans = await ask(msg, 'Enter your custom content type :');
          if (!ans) return msg.channel.send('Time Out! Command Cancelled.');
          lang = ans;
        }
      } catch (err: any) {
        return msg.reply(err.message);
      }
    }

    [response, title] = await POST(args[0], code, headers);
  } else if (
    args[1].toLowerCase() == '-h' ||
    args[1].toLowerCase() == '--headers'
  ) {
    [response, title] = await Headers(args[0]);
  } else {
    return msg.reply(
      `*__${args[1].replace(
        /([\*\`\~\_])/g,
        '\\$1',
      )}__* isn't a valid flag. Currently it only supports :\n   • \`[ -p ]\` or \`[ --post ]\` : POST REQUEST\n   • \`[ -g ]\` or \`[ --get ]\` : GET REQUEST (Default)\n   • \`[ -h ]\` or \`[ --headers ]\` : GET HEADERS`,
    );
  } //`
  //type = type.includes('+')?type.split("+")[0]:type.split("/")[1]
  let langGuess = parse(title ?? 'application/error').type.split('/')[1];
  if (langGuess == 'json') {
    try {
      response = inspect(JSON.parse(response), { depth: Infinity });
      langGuess = 'js';
    } catch (err) {}
  }
  new stringPagination(msg, response, {
    decoration: { lang: langGuess, title },
  });
}

/////////////////////////////////////////////////

/**fetch HEADERS*/
async function Headers(url: string) {
  const response = await fetch(url)
    .then((resp) => resp.headers)
    .then((obj) => inspect(obj))
    .catch((err) => err.message);
  return [response, 'application/javascript'];
}

/**fetch GET request*/
async function GET(
  url: string,
  headers: { [index: string]: string } | undefined,
) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 6000);

  const response = await fetch(url, {
    signal: controller.signal as AbortSignal,
    headers,
  })
    .then(async (r) => [await r.text(), r.headers.get('content-type')])
    .catch((err) => {
      if (err.type == 'aborted')
        //warn if time exceeds
        return [
          'fetch request aborted! exceeds timelimit of 6000ms',
          'text/warning',
        ];
      return [err.message, 'text/plain'];
    });
  return response;
}

/**fetch POST request*/
async function POST(
  url: string,
  data: string,
  headers: { [index: string]: string },
) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE,
    headers: headers,
    redirect: 'follow',
    body: data,
  })
    .then(async (r) => [await r.text(), r.headers.get('content-type')])
    .catch((err) => {
      if (err.type == 'aborted')
        //warn if time exceeds
        return [
          'fetch request aborted! exceeds timelimit of 6000ms.',
          'text/warning',
        ];
      return [err.message, 'text/plain'];
    });
  return response;
}
