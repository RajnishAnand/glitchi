import { MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'Interfaces';

export const command: Command = {
	name: 'feedback',
	description: 'Send feedback',
	examples: ['testing feedback command'],
	aliases: ['fd'],
	usage: '<..feedbackText>',
	args: true,

	run({ msg, args, commandName }) {
		const text = args
			.join(' ')
			//.replace(/\n+/,'\n');
			.replace(/\n{2,}/g, '\n');
		const suggest = commandName == 'suggest';
		const embed = new MessageEmbed({
			title: `📮| ${suggest ? 'Suggestion' : 'Feedback'} : `,
			color: '#1ac95d',
			description: '>>> ' + text,
			thumbnail: {
				url: msg.author.displayAvatarURL({
					format: 'png',
					dynamic: true,
					size: 4096
				})
			},
			fields: [
				{
					name: '🥷| Userinfo : ',
					value: '```\n' + `Username : ${msg.author.tag}\nID : ${msg.author.id}\nGuild : ${msg.guild?.name}` + '```'
				}
			],
			timestamp: new Date()
		});
		//msg.delete();
		(msg.client.channels.cache.get(suggest ? msg.client.config.channels.suggestion : msg.client.config.channels.feedback) as TextChannel)
			.send({ embeds: [embed] })
			.then((m) => {
				if (suggest) {
					m.react(msg.client.config.emojis.thumbsup);
					m.react(msg.client.config.emojis.thumbsdown);
				}
			})
			.catch(() => {
				msg.channel.send('There was an error while sending your Feedback! Please inform this to devloper!');
				// this.error(msg,err);
			})
			.then(() =>
				msg.channel.send(
					`Thank you for your ${suggest ? 'Suggestion' : 'Feedback'}! Your ${
						suggest ? 'Suggestion' : 'Feedback'
					} was successfully sent to support server.\😊`
				)
			);
	}
};
