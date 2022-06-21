import { MessageEmbed } from 'discord.js';

export default class EmbedHandler {
	public page = 1;
	public length: number;
	private chunks: MessageEmbed[];
	constructor(chunks: MessageEmbed[]) {
		this.length = chunks.length;
		this.chunks = chunks;
	}

	get value() {
		return [this.chunks[this.page - 1]];
	}
}
