import { MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'Interfaces';

export const command: Command = {
	name: 'report',
	description: 'send a bug report to support server',
	aliases: ['bug'],
	usage: '↪<reply:Message> ?<description>',
	args: false,

	async run({ msg, args, content }) {
		if (!msg.reference && !msg.content.length) {
			msg.reply('Please add description about the bug!');
			return;
		}
		let embed = new MessageEmbed({
			title: '🪛| Bug Report :',
			fields: []
		});
		if (args.length) embed.description = '>>> ' + content();
		if (msg.reference && msg.reference.messageId)
			await msg.channel.messages.fetch(msg.reference.messageId).then((m) => {
				embed.fields?.push({
					name: '🌡| Referenced Message :',
					value:
						`­     └⊸ ID : [${msg.reference?.messageId}](https://discord.com/channels/${msg.guild?.id}/${msg.channel.id}/${msg.reference?.messageId})\n` +
						(m.embeds.length
							? '```json' + `\n${JSON.stringify(m.embeds).replace(/```/g, '`­``')}}` + '```\n'
							: `>>> ${m.content.substring(0, 500)}`),
					inline: false
				});
			});

		embed.fields?.push({
			name: '🥷| Userinfo : ',
			value: `├⊶ Username : \`${msg.author.tag}\`\n├⊷ ID : \`${msg.author.id}\`\n├⊷ Guild : \`${msg.guild?.name}\`\n└⊶ MID : [${msg.id}](https://discord.com/channels/${msg.guild?.id}/${msg.channel.id}/${msg.id})`,
			inline: true
		});
		(msg.client.channels.cache.get(msg.client.config.channels.bugReport) as TextChannel).send({ embeds: [embed] }).then((m) => {
			Promise.all([m.react(msg.client.config.emojis.thumbsup), m.react(msg.client.config.emojis.thumbsdown), m.react('🪛')]);
		});
		msg.channel.send(
			msg.client.config.emojis.sneak + ' Sorry for your inconvenience. Bug was successfully reported to support server and will be fixed soon!'
		);
	}
};
