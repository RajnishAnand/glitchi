import { messageinfo, objectPagination } from '#libs';
import { Message } from 'discord.js';
import { SlashCommand } from 'Interfaces';

export const command: SlashCommand = {
	name: 'messageinfo',
	type: 'MESSAGE',

	run({ interaction }) {
		try {
			new objectPagination(interaction, messageinfo(interaction.targetMessage as Message));
		} catch (_) {}
	}
};
