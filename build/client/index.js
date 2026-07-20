"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
class ExtendClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildPresences,
                discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
                discord_js_1.GatewayIntentBits.GuildMessageReactions,
                discord_js_1.GatewayIntentBits.MessageContent,
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
        this.config = config_1.default;
        this.applicationCommands = new discord_js_1.Collection();
        this.textCommands = new discord_js_1.Collection();
        this.zLinkCommands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
    }
    async init() {
        console.log('logging in..\n');
        await this.login(process.env.TOKEN);
        // this.loadApplicationCommands();
        this.loadTextCommands();
        // this.loadZlinkCommands();
        this.loadEvents();
        this.registerGlobalSlashCommand([
            ...this.applicationCommands.filter((c) => c.global).values(),
        ]);
    }
    // events
    loadEvents() {
        const eventsPath = path_1.default.join(__dirname, '..', 'events');
        const eventFiles = (0, fs_1.readdirSync)(eventsPath).filter((f) => f.endsWith('.js'));
        eventFiles.forEach((file) => {
            const event = require(`${eventsPath}/${file}`).event;
            this.events.set(event.name, event);
            if (event.once)
                this.once(event.name, event.execute.bind(null, this));
            else
                this.on(event.name, event.execute.bind(null, this));
        });
    }
    // text commands
    loadTextCommands() {
        const commandsPath = path_1.default.join(__dirname, '..', 'commands/text');
        const commandFolders = (0, fs_1.readdirSync)(commandsPath);
        commandFolders.forEach((folder) => {
            const commandFiles = (0, fs_1.readdirSync)(`${commandsPath}/${folder}`).filter((file) => file.endsWith('.js'));
            commandFiles.forEach((file) => {
                const filePath = `${commandsPath}/${folder}/${file}`;
                delete require.cache?.[require.resolve(filePath)];
                const command = require(filePath).command;
                command.category = folder;
                this.textCommands.set(command.name, command);
                if (command?.aliases?.length) {
                    command.aliases.forEach((alias) => {
                        this.aliases.set(alias, command);
                    });
                }
            });
        });
    }
    // application commands
    loadApplicationCommands() {
        const applicationCommandsPath = path_1.default.join(__dirname, '..', 'commands/application');
        const applicationCommandFiles = (0, fs_1.readdirSync)(applicationCommandsPath).filter((f) => f.endsWith('.js'));
        applicationCommandFiles.forEach(async (filePath) => {
            const applicationCommand = require(`${applicationCommandsPath}/${filePath}`).command;
            this.applicationCommands.set(applicationCommand.name, applicationCommand);
        });
    }
    // zLink commands
    async loadZlinkCommands() {
        const zLinkCommandsPath = path_1.default.join(__dirname, "..", "commands/zlinks");
        const zlinkCommandFiles = (0, fs_1.readdirSync)(zLinkCommandsPath).filter((f) => f.endsWith(".js"));
        zlinkCommandFiles.forEach(async (filePath) => {
            const zLinkCommand = require(`${zLinkCommandsPath}/${filePath}`).zlink;
            this.zLinkCommands.set(zLinkCommand.name, zLinkCommand);
        });
    }
    // register global commands
    async registerGlobalSlashCommand(commands) {
        return this.application?.commands
            .set(commands)
            .then((_) => true)
            .catch((_) => false);
    }
    updateStatus() {
        this.user?.setPresence({
            activities: [
                {
                    name: `@${this.user.username} in ${this.guilds.cache.size} servers`,
                    type: discord_js_1.ActivityType.Listening,
                },
            ],
        });
    }
    searchEmoji(q) {
        let emojis = this.emojis.cache.filter((f) => new RegExp(q, 'i').test(`${f.name}`));
        const result = {};
        for (let [_, e] of emojis) {
            if (Object.keys(result).length > 24)
                return result;
            if (!e.name)
                continue;
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
exports.default = ExtendClient;
