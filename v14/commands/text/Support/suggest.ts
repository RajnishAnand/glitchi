import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'suggest',
  description: 'send suggestions',
  argsHelp: ['<...suggestionsText>'],
  args: true,
  examples: ['this is a suggestion!'],

  run(arg) {
    (arg.client.textCommands.get('feedback') as TextCommand)?.run(arg);
  },
};
