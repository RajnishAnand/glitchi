import Client from '../client';
import { Event } from '../Interfaces';

export const event: Event = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		// delete risky enviromental variables once client is ready
		delete process.env.TOKEN;
		delete process.env.FIRE;

		if (!client.user) return new Error('User not found in Client!');

		// set status when in production
		if (!process.env.BETA)
			client.user.setPresence({
				status: 'online',
				activities: [
					{
						name: `${client.config.prefix} commands in ${client.guilds.cache.size} servers`,
						type: 'LISTENING'
					}
				]
			});

		console.log('Logged in as ' + client.user.tag);
	}
};
