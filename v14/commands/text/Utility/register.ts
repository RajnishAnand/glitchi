import { TextCommand } from 'client/interface';
import {
  ApplicationCommandDataResolvable,
  ApplicationCommandType,
} from 'discord.js';

export const command: TextCommand = {
  name: 'register',
  description: 'deploy slash commands',
  aliases: ['applicationcommnads', 'appc'],
  args: true,
  argsHelp: ['?<add|rm|update|set|list>', '?<commandName>|<...commanName>'],
  examples: ['add ping', 'update', 'list'],
  // userPerms: ['Administrator'],
  ownerOnly: true,

  async run({ client, msg, args }) {
    if (!msg.guild) return;
    args = args.map((a) => a.toLowerCase());
    const subCommand = args.shift();

    if (subCommand == 'list') list();
    else if (subCommand == 'add') add();
    else if (subCommand == 'rm' || subCommand == 'remove') remove();
    else if (subCommand == 'update') update();
    else if (subCommand == 'set') set();
    else
      return msg.reply(
        `Use \`${client.config.prefix}help deploy\` to get help.`,
      );

    //List commands
    function list() {
      return msg.reply({
        embeds: [
          {
            color: 0x000000,
            author: {
              name: client.user!.tag,
              icon_url: client.user!.displayAvatarURL(),
            },
            title: 'Avaliable Slash Commands : ',
            description: client.applicationCommands
              .filter((c) => !c.global)
              .map((c) => {
                return `${c.name} : ${
                  !c.type || c.type == ApplicationCommandType.ChatInput
                    ? c.description
                    : c.type
                }`;
              })
              .join('\n'),
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    // add command
    function add() {
      if (!args[0])
        return msg.reply('Please also provide name of a slashCommands to add.');

      const command: ApplicationCommandDataResolvable | undefined =
        client.applicationCommands.get(args[0]);

      if (!command)
        return msg.reply({
          content: `Requested command not found. Please check avaliable commands using \`${client.config.prefix}deploy list\``,
          allowedMentions: { repliedUser: false },
        });
      msg
        .guild!.commands.create(command)
        .then(() => {
          msg.channel.send(
            `${client.config.emojis.salute} Successfully added /${command.name} command.`,
          );
        })
        .catch((e) => {
          console.log(e);
          msg.reply(`Failed to add /${command.name} command`);
        });
    }

    // remove commands
    async function remove() {
      if (!args[0])
        return msg.reply(
          'Please also provide name of registered slash command to remove!',
        );

      const command = await msg
        .guild!.commands.fetch({ cache: false })
        .then((l) => l.find((c) => c.name == args[0]));

      if (!command)
        return msg.reply({
          content: `Requested command isn't registered in your guild.`,
          allowedMentions: { repliedUser: false },
        });

      msg
        .guild!.commands.delete(command)
        .then(() => {
          msg.channel.send(
            `${client.config.emojis.salute} Successfully removed /${command.name} command.`,
          );
        })
        .catch((e) => {
          console.log(e);
          msg.reply(`Failed to remove /${command.name} command`);
        });
    }

    // update commands
    async function update() {
      const commands = await msg.guild!.commands.fetch({ cache: false });
      if (!commands)
        return msg.reply({
          content: "There aren't any slashCommands registered in your guild!",
          allowedMentions: { repliedUser: false },
        });

      try {
        commands.forEach(async (c) => {
          const cmd = client.applicationCommands.get(c.name);
          if (cmd) await msg.guild!.commands.edit(c, cmd);
          else await msg.guild!.commands.delete(c);
        });
        msg.channel.send(
          client.config.emojis.salute +
            'Successfully updated all registered commands.',
        );
      } catch (e) {
        msg.reply('Failed to update slash commands!');
      }
    }

    // set commands
    function set() {
      if (!args.length)
        return msg.reply(
          'Please also provide names slash command to register!',
        );

      const commands = client.applicationCommands
        .filter((c) => args.includes(c.name) || args[0] == 'all')
        .map((c) => c);

      if (!commands.length)
        return msg.reply({
          content:
            'Please pick commands names avaliable from the list. Type `' +
            client.config.prefix +
            'deploy list` to get a lust of avaliable slash commands.',
          allowedMentions: { repliedUser: false },
        });

      msg
        .guild!.commands.set(commands)
        .then(() => {
          msg.channel.send(
            `Commands: ${commands.map((c) => c.name)}\n${
              client.config.emojis.salute
            }Successfully registered.`,
          );
        })
        .catch(() => {
          msg.reply('Failed to register requested slash commands.');
        });
    }
  },
};
