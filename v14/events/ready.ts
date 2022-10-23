import { Event } from 'client/interface';

export const event: Event = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user?.setStatus('idle');
    if (!process.env.BETA) client.updateStatus();
    delete process.env.TOKEN;

    console.log('logged in as', client.user!.tag);
  },
};
