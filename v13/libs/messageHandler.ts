import { GuildMember, MessageOptions } from 'discord.js';
import { Command, CommandArgument, ExtendMessage } from 'Interfaces';
import Client from '../client';

export async function messageHandler(
  client: Client,
  msg: ExtendMessage,
): Promise<messageHandlerReturn> {
  if (msg.author.bot || msg.channel.type == 'DM' || !msg.guild) return;

  // ignore if can't message in this channel
  const perms = msg.channel.permissionsFor(msg.client.user!.id);
  if (!(perms && perms.has('SEND_MESSAGES'))) return;

  // ignore if this is a protected run
  if (process.env.PROTECTED) {
    const owner = await msg.client.guilds
      .fetch(client.config.guildId)
      .then(
        (g) =>
          g.ownerId === msg.author.id &&
          msg.author.id === client.config.ownerId,
      )
      .catch(() => false);
    if (!owner) return;
  }

  // ignore if user don't have betaTester role
  // when running in beta mode.
  if (process.env.BETA) {
    let betaTester = await msg.client.guilds
      .fetch(client.config.guildId)
      .then(async (g) => g.members.fetch(msg.author.id))
      .then((m) => m.roles.cache.has(client.config.roles.betaTesters))
      .catch(() => false);
    if (!betaTester) return;
  }

  // ingnore if this channel is blocked
  if (
    msg.channel.id in client.config.block &&
    client.config.block[msg.channel.id] == msg.author.id
  )
    return;

  // reply with prefix if mentioned
  if (msg.content.startsWith(`<@${msg.client.user?.id}>`) && !msg.editedAt) {
    msg.reply({
      content: `Hi there ${msg.author.username}. My prefix is \`${client.config.prefix}\` , Type \`${client.config.prefix}help\` for help. `,
    });
    return;
  }

  // ingnore if message dosen't starts with prefix
  else if (
    !msg.content.toLowerCase().startsWith(client.config.prefix) ||
    !msg.content
  )
    return;

  // find command
  const args = msg.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +|\n/);
  let commandName = (args.shift() as string).toLowerCase();
  const command =
    client.commands.get(commandName) || client.aliases.get(commandName);

  // ignore if command dosent exists
  if (!command) return;

  // check if command is role specific
  if (command.roleAccess) {
    const id = client.config.roles[command.roleAccess];
    if (
      !(await client.guilds
        .fetch(client.config.guildId)
        .then((g) => g.members.fetch(msg.author.id))
        .then((m) => m.roles.cache.has(id))
        .catch((_) => false))
    )
      return {
        command,
        error: 'ROLEONLY',
        message: `This command is specific to "@${command.roleAccess}" only. You need to get this role on support server to use it.`,
      };
  }

  // My permissions required
  if (command.requiredPerms) {
    const myPerms = msg.channel.permissionsFor(msg.guild.me as GuildMember);
    if (!myPerms || !command.requiredPerms.every((c) => myPerms.has(c))) {
      return {
        command,
        error: 'PERMIMISS',
        message: `Permission(s) i require to run this command:\n  └⊳ \` ${command.requiredPerms.join(
          '`\n  └⊳ `',
        )} \``,
      };
    }
  }

  //User perms required
  if (command.userPerms && msg.author.id != client.config.ownerId) {
    const authorPerms = msg.channel.permissionsFor(msg.author);
    if (!authorPerms || !command.userPerms.every((c) => authorPerms.has(c))) {
      return {
        command,
        error: 'PERMUMISS',
        message: ` Permission(s) required to run this command :\n  └⊳ \` ${command.userPerms.join(
          '`\n  └⊳ `',
        )} \``,
      };
    }
  }

  // ignore if user is running devOnly commands
  // and is not dev
  if (
    (command.devOnly || false) == true &&
    (msg.author.id != client.config.ownerId) == true
  ) {
    return;
  }

  // suggest to use help if user not providing args
  // in args required commands
  else if (command.args && !args.length) {
    return {
      command,
      error: 'ARGSMISSING',
      message: `${
        command.usage ? '```\n' + command.usage + ' ``` ' : ''
      }Command : \` ${command.name} \` requires argument! ${
        client.config.emojis.sneak
      }.\nType \`${client.config.prefix}help ${
        command.name
      }\` to get help on it.`,
    };
  }

  // execute command
  else {
    const content = () =>
      msg.content
        .substring(client.config.prefix.length)
        .replace(/^[\s+]?/, '')
        .replace(commandName + ' ', '');
    return {
      args: { msg, args, content, commandName },
      command,
      // error:this.err
    };
  }
}

type messageHandlerReturn =
  | {
      command: Command;
      args: CommandArgument;
    }
  | {
      error: string;
      message: string;
      command?: Command;
    }
  | undefined;
