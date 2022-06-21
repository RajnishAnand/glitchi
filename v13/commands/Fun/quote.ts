import { MessageEmbed } from 'discord.js';
import { Command } from 'Interfaces';
import { quoteById, randomQuote } from '../../APIs/@quotes';

export const command: Command = {
	name: 'quote',
	aliases: ['quotable'],
	description: 'Get quotes from qoutable API',
	async run({ msg, args }) {
		let quote: MessageEmbed | undefined;
		try {
			if (!args.length || args[0].toLowerCase() == 'random') quote = await randomQuote().then((q) => q.embedify());
			else quote = await quoteById(args[0]).then((r) => r.embedify());
		} catch (err: any) {
			msg.reply(err.message);
		}
		// Quote with a specific id
		if (quote)
			msg.reply({
				embeds: [quote],
				allowedMentions: {
					repliedUser: false
				}
			});
	}
};
