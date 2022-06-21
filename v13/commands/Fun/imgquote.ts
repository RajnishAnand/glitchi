import imgQuote from '#api/imageQuote.js';
import { Command } from 'Interfaces';

export const command: Command = {
	name: 'imgquote',
	description: 'Quotes with image',
	aliases: ['insp', 'imagequote', 'inspire'],
	roleAccess: 'betaTesters',
	run({ msg }) {
		imgQuote()
			.then((t) =>
				msg.reply({
					files: [t],
					allowedMentions: { repliedUser: false }
				})
			)
			.catch(() => msg.reply(msg.client.config.emojis.sad + ' An Unknown Error Occurred while fetching from api.'));
	}
};
