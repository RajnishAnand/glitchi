import { embedPagination } from '#libs';
import { EmbedBuilder } from '@discordjs/builders';
import { TextCommand, TextCommandOptions } from 'client/interface';

export const command: TextCommand = {
  name: 'help',
  description: 'List of all Commands!',
  aliases: ['commands', 'list'],
  args: false,
  argsHelp: ['?<command_name>'],
  examples: ['emoji', 'fetch'],
  run,
};

async function run({ client, msg, args }: TextCommandOptions) {
  if (!args.length) {
    let cmnds = client.textCommands.filter((cmd) => !cmd.ownerOnly);
    let data: { [key: string]: string } = {};
    cmnds.forEach((cmd) => {
      if (cmd.category == undefined) return;
      if (!(cmd.category in data)) data[cmd.category] = '';
      data[cmd.category] += `${cmd.roleAccess ? '🔸' : '🔹'} **${
        cmd.name
      } ⤍**  *${cmd.description}*\n`;
    });

    Object.keys(data).forEach((c) => {
      data[
        c
      ] += `>>> Use \`${client.config.prefix}help <CommandName>\` to get more help on it.`;
    });

    new embedPagination(
      msg,
      Object.keys(data).map((m: string) => {
        return new EmbedBuilder({
          title: `Help >> Category: ${m}`,
          description: data[m],
          color: 0x00bfff,
        });
      }),
    );
  } else {
    const command: TextCommand | undefined =
      client.textCommands.get(args[0]) || client.aliases.get(args[0]);

    if (!command)
      return msg.reply({
        content:
          client.config.emojis.sad +
          'There is no such command as `' +
          args[0] +
          '`',
        allowedMentions: { repliedUser: false },
      });

    const embed = new EmbedBuilder({
      color: 0x00bfff,
      title: `${client.config.emojis.yus}|Help >> Command: ${command.name}`,
      description: '🔹 **Description** : ' + command.description,
      fields: [],
    });
    let description = '';
    // Aliases
    if (command.aliases)
      description += `\n🔹 **Aliases** : ${command.aliases.join(', ')}`;

    // Arguments
    if (command.args) description += '\n🔹 **Arguments required** : `true`';

    // Usage
    if (command.argsHelp)
      description += '\n🔹 **Usage** : `' + command.argsHelp.join(' ') + '`';

    // Permission
    if (command.userPerms)
      description +=
        '\n🔹 **Permission Required** : ' + command.userPerms.join(', ');

    // RoleAccess
    if (command.roleAccess)
      description += `\n🔸 **RoleAccess** : \`${command.roleAccess}\``;

    // DevOnly
    if (command.ownerOnly) description += '\n🔹 **Bot Owner Only** : `true`';

    embed.setDescription(description);

    // Exemples
    if (command.examples || !command.args) {
      const cmdNames = [...(command.aliases ?? ''), command.name];
      embed.addFields({
        name: '**Examples** :',
        value: `>>> ${
          command.args ? '' : `\`${client.config.prefix}${command.name}\`\n`
        }${
          command.examples?.length
            ? command.examples
                .map(
                  (e) =>
                    '`' +
                    client.config.prefix +
                    cmdNames[~~(Math.random() * cmdNames.length)] +
                    ' ' +
                    e +
                    '`',
                )
                .join('\n')
            : ''
        }`,
      });
    }

    msg.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  }
}
