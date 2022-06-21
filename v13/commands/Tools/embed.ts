import { stringPagination } from '#libs';
import { CBParser } from 'cbparser';
import { MessageEmbed } from 'discord.js';
import { Command } from 'Interfaces';

export const command: Command = {
	name: 'embed',
	description: 'convert your json-code to Embed',
	args: true,
	usage: '<json-Embed>',

	run({ msg, content }) {
		let txt = content().replace(/[­ ]/g, '');
		txt = CBParser(txt)[0]?.code.replaceAll('\\`', '`') ?? txt;

		try {
			let obj = JSON.parse(txt);

			let embeds: MessageEmbed[];
			if (Array.isArray(obj)) embeds = obj.map((e) => new MessageEmbed(e));
			else embeds = [new MessageEmbed(obj)];
			// if (!Array.isArray(obj))
			msg.reply({
				embeds,
				allowedMentions: { repliedUser: false }
			}).catch((e) => {
				new stringPagination(msg, e.message, {
					decoration: { lang: 'js', title: 'EmbedError' }
				});
			});
		} catch (err: any) {
			new stringPagination(msg, err.message, { decoration: { lang: 'JSON_ERROR' } });
		}

		//msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a  **"code-block"**');
	}
};
