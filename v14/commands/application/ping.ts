import { ApplicationCommand } from 'client/interface';

export const command: ApplicationCommand = {
  name: 'ping',
  description: 'ping pong!',
  global: false,

  run({ interaction }) {
    interaction.reply({ content: 'ping pong!', ephemeral: true });
  },
};
