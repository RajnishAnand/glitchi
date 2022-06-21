import { Message } from 'discord.js';
import { inspect } from 'util';
import { ObjectPaginationData } from './pageview';

export default function mInfo(m0: Message) {
	let m: Partial<Message> = Object.assign({}, m0);
	const data: ObjectPaginationData = [];

	// content
	const content = m.content!.length ? m.content : undefined;
	delete m.content;

	// embed
	const embeds = m.embeds!.length ? JSON.stringify(m.embeds, null, '  ') : undefined;
	delete m.embeds;

	// author
	const author = inspect(m.author);
	delete m.author;

	data.push({
		title: 'Overview',
		description: 'Message Overview',
		text: inspect(m),
		emoji: '🤘',
		options: { split: { with: ',' }, decoration: { lang: 'js', title: 'Messageinfo[Overview]' } }
	});

	data.push({
		title: 'Author',
		description: "Message's Author Info",
		text: author,
		emoji: '🕵️',
		options: { split: { with: ',' }, decoration: { lang: 'js', title: 'Messageinfo[Author]' } }
	});

	if (embeds)
		data.push({
			title: 'Embeds',
			description: 'Message Embeds in JSON',
			text: embeds,
			emoji: '🏺',
			options: { split: { with: ',' }, decoration: { lang: 'js', title: 'Messageinfo[Embeds]' } }
		});

	if (content)
		data.push({
			title: 'Content',
			description: 'Message Content',
			text: content,
			emoji: '🐏',
			options: { decoration: { title: 'Messageinfo[Content]' } }
		});

	return data;
}
