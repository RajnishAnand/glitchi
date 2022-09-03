import { attachDeletable, select, stringPagination } from '#libs';
import { Command } from 'Interfaces';

export const command: Command = {
  name: 'addemoji',
  aliases: ['ae', 'adde'],
  description: 'adds emoji',
  requiredPerms: ['MANAGE_EMOJIS_AND_STICKERS'],
  userPerms: ['MANAGE_EMOJIS_AND_STICKERS'],
  usage: '?<name> ?<url|emoji>',

  async run({ msg, args, fetchRef }) {
    let emojiName: undefined | string;
    let emojiUrl: undefined | string;
    const ereg = /<(a)?:(\w{1,20}):(\d{1,32})>/g;
    const ureg = /https\:\/\/\S+/g;
    const ref = await fetchRef();

    // no reference or argument
    if (!args.length && !ref) {
      return msg
        .reply({
          content: `Arguments or Reference Missing!\n\`\`\`\n${this.usage}\`\`\``,
        })
        .then((m) => attachDeletable(m, msg.author.id));
    }

    // reference but no argument
    else if (!args.length) {
      return msg
        .reply({
          content: `Please also include name of the emoji;`,
        })
        .then((m) => attachDeletable(m, msg.author.id));
    }

    // if all arguments
    else if (args.length > 1) {
      emojiName = args[0];
      if (new RegExp(ureg).test(args[1])) emojiUrl = args[1];
      else if (new RegExp(ereg).test(args[1])) emojiUrl = emojiToUrl(args[1]);
      else
        return msg
          .reply({
            content: `Unable to recognise Second argument as URL or Emoji!\`\`\`\n${this.usage}\`\`\``,
          })
          .then((m) => attachDeletable(m, msg.author.id));
    }

    // from attachment
    else if (msg.attachments.size) {
      emojiName = args[0];
      emojiUrl = msg.attachments.first()?.url as string;
    }

    // all from reference message
    else if (ref) {
      emojiName = args[0];
      // from ref url
      if (new RegExp(ureg).test(ref.content)) {
        const matches = [...ref.content.matchAll(new RegExp(ureg))].reduce(
          (a, e) => (a.includes(e[0]) ? a : [...a, e[0]]),
          [],
        );
        if (matches.length > 1)
          emojiUrl = await select(msg, {
            title: 'Select URL',
            options: matches.map((m, i) => ({
              label: m,
              value: m,
              description: `Matched URL at ${i}`,
            })),
          }).catch(() => undefined);
        else emojiUrl = matches[0];
      }
      // from ref emojis
      else if (new RegExp(ereg).test(ref.content)) {
        const matches = [...ref.content.matchAll(new RegExp(ereg))].reduce(
          (a, e) => (a.includes(e[0]) ? a : [...a, e[0]]),
          [],
        );
        if (matches.length > 1)
          emojiUrl = await select(msg, {
            title: 'Select Emoji',
            options: matches.map((m) => ({
              label: m,
              value: emojiToUrl(m),
              emoji: m,
            })),
          }).catch(() => undefined);
        else emojiUrl = matches[0];
      }
      // feom ref attachment
      else if (ref.attachments.size)
        emojiUrl = ref.attachments.first()?.url as string;
      // from ref imo command
      else if (ref.embeds[0]?.url) emojiUrl = ref.embeds[0].url;
      if (emojiUrl == undefined)
        return msg
          .reply({
            content:
              'Unable to find any appropriate URL, Emojis or attachement in the reference message.',
          })
          .then((m) => attachDeletable(m, msg.author.id));
    } else
      return msg
        .reply({
          content: `Unable to recognise Second argument as URL or Emoji!\`\`\`\n${this.usage}\`\`\``,
        })
        .then((m) => attachDeletable(m, msg.author.id));

    //test url
    if (!emojiName || !emojiUrl)
      return msg
        .reply({
          content: 'Resolved url is undefined. request cancelled.',
        })
        .then((m) => attachDeletable(m, msg.author.id));
    try {
      emojiUrl = new URL(emojiUrl).toString();
    } catch (_) {
      return msg
        .reply({
          content: '```\nInvalid URL:' + emojiUrl + ' ```',
          allowedMentions: { repliedUser: false },
        })
        .then((m) => attachDeletable(m, msg.author.id));
    }

    // add Emoji
    msg.guild?.emojis
      .create(emojiUrl, emojiName, {
        reason: `requested by ${msg.author.tag}`,
      })
      .then((e) => {
        msg.reply({
          allowedMentions: { repliedUser: false },
          content: `Successfully added emoji ${e} with name ${e.name}.`,
        });
      })
      .catch((e) => {
        new stringPagination(msg, e.message, {
          split: { with: ',' },
          decoration: { lang: 'js', title: 'ERROR' },
        });
      });
  },
};

function emojiToUrl(e: string) {
  const ereg = /<(a)?:(\w{1,20}):(\d{1,32})>/g;
  return `https://cdn.discordapp.com/emojis/${e[3]}.${e[1] ? 'gif' : 'png'}`;
}
