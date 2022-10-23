import { Command } from 'Interfaces';

export const command: Command = {
  name: 'suggest',
  description: 'send suggestions',
  usage: '<...suggestionsText>',
  args: true,
  examples: ['this is a suggestion!'],

  run(arg) {
    (arg.msg.client.commands.get('feedback') as typeof this)?.run(arg);
  },
};
