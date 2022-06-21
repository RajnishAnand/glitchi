import { stringPagination } from '#libs';
import { Command } from 'Interfaces';

export const command: Command = {
	name: 'content',
	description: 'content of message',
	aliases: ['c'],
	usage: '<#channel|channelID|messageID> ?<messageID>',

	async run({ msg, args }) {
		let channel: typeof msg.channel | undefined;
		let messageID: string | undefined;

		//warn if messages has no reference
		if (!msg.reference?.messageId && !args.length) {
			msg.reply(msg.client.config.emojis.aha + ' Looks like you forgot to enter Message Id');
			return;
		}

		// resolve channel & messageID if referenced
		if (!args.length) {
			channel = msg.channel;
			messageID = msg.reference?.messageId;
		}

		//  resolve channel & messageID if in args
		else if (args.length >= 2) {
			let chID = args[0].replace(/^<#/, '').replace(/>$/, '');
			messageID = args[1];
			if (!/^\d+$/.test(chID)) return msg.reply(`unable to resolve \`${args[0]}\` as channel.`);
			if (!/^\d+$/.test(messageID)) return msg.reply(`unable to resolve \`${args[1]}\` as messageID`);
			msg.client.channels.fetch(chID).then((c) => {
				if (c?.isText && c.type == 'GUILD_TEXT') channel = c;
			});
			if (!channel) return msg.reply('unable to resolve channel.');
		}

		// resolve message if its from same channel
		else {
			if (!/^\d+$/.test(args[0])) return msg.reply(`unable to resolve \`${args[0]}\` as messageID`);
			messageID = args[0];
			channel = msg.channel;
		}

		// send error if failed to resolve channel or msgID
		if (!messageID || !channel) return msg.channel.send('Error getting content!');

		let messages = channel.messages;

		// fetch & send content
		if (messages) {
			messages.fetch(messageID).then((m0) => {
				if (m0.content.length) new stringPagination(msg, m0.content);
				else
					msg.reply({
						content: 'Referenced message has no content. Try `messageinfo` for detailed information about the message.'
					});
			});
		} else {
			msg.reply(`message with id \`${messageID}\` not Found!`);
		}
	}
};
