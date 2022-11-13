import { TextCommand } from 'client/interface';
import { quoteById, randomQuote } from '#api/@quotes';
import { EmbedBuilder } from '@discordjs/builders';

export const command: TextCommand = {
  name: 'quote',
  aliases: ['quotable'],
  description: 'Get quotes from qoutable API',
  args: false,
  argsHelp: ['?:id'],
  async run({ msg, args }) {
    let quote: EmbedBuilder | undefined;
    try {
      if (!args.length || args[0].toLowerCase() == 'random')
        quote = await randomQuote().then((q) => q.embedify());
      else quote = await quoteById(args[0]).then((r) => r.embedify());
    } catch (err: any) {
      msg.reply(err.message);
    }
    // Quote with a specific id
    if (quote)
      msg.reply({
        embeds: [quote],
        allowedMentions: {
          repliedUser: false,
        },
      });
  },
};
