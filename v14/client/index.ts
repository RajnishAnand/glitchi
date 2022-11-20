import {
  ActivityType,
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  Emoji,
  GatewayIntentBits,
} from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { TextCommand, ApplicationCommand, Event } from './interface';
import Config from './config';

export default class ExtendClient extends Client {
  public config = Config;
  public applicationCommands: Collection<string, ApplicationCommand> =
    new Collection();
  public textCommands: Collection<string, TextCommand> = new Collection();
  public aliases: Collection<string, TextCommand> = new Collection();
  public events: Collection<string, Event> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],

      sweepers: {
        messages: {
          interval: 600000,
          lifetime: 600000,
        },
      },

      failIfNotExists: false,
      allowedMentions: { repliedUser: false },
    });
  }

  async init() {
    console.log('logging in..\n');
    await this.login(process.env.TOKEN);

    this.loadApplicationCommands();
    this.loadTextCommands();
    this.loadEvents();
  }

  // events
  public loadEvents() {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith('.js'));

    eventFiles.forEach((file) => {
      const event: Event = require(`${eventsPath}/${file}`).event;
      this.events.set(event.name, event);

      if (event.once) this.once(event.name, event.execute.bind(null, this));
      else this.on(event.name, event.execute.bind(null, this));
    });
  }

  // text commands
  public loadTextCommands() {
    const commandsPath = path.join(__dirname, '..', 'commands/text');
    const commandFolders = readdirSync(commandsPath);

    commandFolders.forEach((folder) => {
      const commandFiles = readdirSync(`${commandsPath}/${folder}`).filter(
        (file) => file.endsWith('.js'),
      );

      commandFiles.forEach((file) => {
        const filePath = `${commandsPath}/${folder}/${file}`;
        delete require.cache?.[require.resolve(filePath)];
        const command: TextCommand = require(filePath).command;
        command.category = folder;
        this.textCommands.set(command.name, command);

        if (command?.aliases?.length) {
          command.aliases.forEach((alias: string) => {
            this.aliases.set(alias, command);
          });
        }
      });
    });
  }

  // application commands
  public loadApplicationCommands() {
    const applicationCommandsPath = path.join(
      __dirname,
      '..',
      'commands/application',
    );
    const applicationCommandFiles = readdirSync(applicationCommandsPath).filter(
      (f) => f.endsWith('.js'),
    );

    applicationCommandFiles.forEach(async (filePath) => {
      const applicationCommand: ApplicationCommand =
        require(`${applicationCommandsPath}/${filePath}`).command;
      this.applicationCommands.set(applicationCommand.name, applicationCommand);
    });
  }

  // register global commands
  async registerGlobalSlashCommand(
    commands: ApplicationCommandDataResolvable[],
  ) {
    this.application?.commands
      .set(commands)
      .then((_) => true)
      .catch((_) => false);
  }

  updateStatus() {
    this.user?.setPresence({
      activities: [
        {
          name: `${this.config.prefix} commands in ${this.guilds.cache.size} servers`,
          type: ActivityType.Listening,
        },
      ],
    });
  }

  public searchEmoji(q: string) {
    let emojis = this.emojis.cache.filter((f) =>
      new RegExp(q, 'i').test(`${f.name}`),
    );

    const result: { [index: string]: Emoji } = {};
    for (let [_, e] of emojis) {
      if (Object.keys(result).length > 24) return result;
      if (!e.name) continue;
      if (!(e.name in result)) {
        result[`${e.name}`] = e;
        continue;
      }
      for (let i = 1; i < 25; i++) {
        if (!(`${e.name}#${i}` in result)) {
          result[`${e.name}#${i}`] = e;
          break;
        }
      }
    }
    return result;
  }
}
