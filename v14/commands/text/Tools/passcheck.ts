import { rockYou } from '#api/rockyou.js';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'passcheck',
  description: 'checks if text is on dictionary attack list',
  args: true,
  async run({ msg, content }) {
    msg.reply({
      embeds: [await rockYou(content())],
      allowedMentions: {
        repliedUser: false,
      },
    });
  },
};
