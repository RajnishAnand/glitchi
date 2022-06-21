import { owoify } from '#libs';
import { SlashCommand } from 'Interfaces';

export const command: SlashCommand = {
	name: 'owoify',
	description: 'owoify your text',
	options: [
		{
			name: 'text',
			description: 'Text to owoify',
			type: 'STRING',
			required: true
		}
	],

	run({ interaction }) {
		const txt = interaction.options.getString('text') as string;
		interaction.reply({
			content: owoify(txt.toLowerCase())
		});
	}
};
