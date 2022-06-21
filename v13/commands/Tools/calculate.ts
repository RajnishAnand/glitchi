import { inspect } from 'util';
import { compile } from 'mathjs';
import { Command } from 'Interfaces';
import { Stopwatch, stringPagination } from '#libs';

export const command: Command = {
	name: 'calculate',
	aliases: ['calc'],
	description: 'a calculator',
	usage: '<...text>',
	args: true,

	async run({ msg, content }) {
		const stopwatch = new Stopwatch();

		try {
			stopwatch.start();
			const txt = compile(content()).evaluate();
			stopwatch.stop();

			new stringPagination(msg, inspect(txt, { depth: 10 }), {
				split: { with: ',' },
				decoration: {
					lang: 'js',
					title: 'MATH.JS',
					secondaryTitle: `⏱ ${stopwatch.elapsed}s`
				}
			});
		} catch (err: any) {
			new stringPagination(msg, err.message ?? ' ', {
				decoration: {
					lang: 'js',
					title: 'MATH.JS[ERROR]'
				}
			});
		}
	}
};
