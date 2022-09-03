import { Command } from 'Interfaces';

const gifs: { [index: string]: string } = {
  slap: 'https://cdn.discordapp.com/attachments/906985861525155880/1012072465570209852/BJ8o71tD-.gif',
  mustachedisguise:
    'https://cdn.discordapp.com/attachments/906985861525155880/1012068307651797063/image0.gif',
  sleeperattack:
    'https://cdn.discordapp.com/attachments/906985861525155880/1012072341620150343/shoe-throw.gif',
};

export const command: Command = {
  name: 'gif',
  description: 'sends custom picked gifs',
  aliases: ['.'],
  args: true,
  usage: '<gifName>',
  examples: ['slap'],
  roleAccess: 'betaTesters',

  run({ msg, args }) {
    if (!args.length) {
      msg.reply({
        allowedMentions: { repliedUser: false },
        content: `__**Avaliable Gifs :**__\n\`${Object.keys(gifs).join(
          '`, `',
        )}\``,
      });
    } else {
      if (args[0] in gifs) {
        msg.channel.send({ files: [gifs[args[0]]] });
      } else {
        msg.reply(
          `GIF not in the list. Currently avaliable: \n\`${Object.keys(
            gifs,
          ).join('`, `')}\``,
        );
      }
    }
  },
};
