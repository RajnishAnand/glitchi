import { ApplicationCommand } from 'client/interface';

export const command: ApplicationCommand = {
  name: 'poing',
  description: 'ping pong!',
  run({ interaction }) {
    interaction.reply({
      content: 'pong!',
    });
  },
};
