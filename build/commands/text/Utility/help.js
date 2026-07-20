"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'help',
    description: 'List of all Commands!',
    aliases: ['commands', 'list'],
    args: false,
    argsHelp: ['?<command_name>'],
    examples: ['emoji', 'fetch'],
    run,
};
async function run({ client, msg, args }) {
    if (!args.length) {
        let cmnds = client.textCommands.filter((cmd) => !cmd.ownerOnly);
        let data = {};
        cmnds.forEach((cmd) => {
            if (cmd.category == undefined)
                return;
            if (!(cmd.category in data))
                data[cmd.category] = '';
            data[cmd.category] += `${cmd.roleAccess ? '🔸' : '🔹'} **${cmd.name} ⤍**  *${cmd.description}*\n`;
        });
        Object.keys(data).forEach((c) => {
            data[c] += `>>> Use \`${client.config.prefix}help <CommandName>\` to get more help on it.`;
        });
        (0, _libs_1.createEmbedPagination)(msg, Object.keys(data).map((m) => {
            return new discord_js_1.EmbedBuilder({
                title: `Help >> Category: ${m}`,
                description: data[m],
                color: 0x00bfff,
            });
        }));
    }
    else {
        const command = client.textCommands.get(args[0]) || client.aliases.get(args[0]);
        if (!command)
            return msg.reply({
                content: client.config.emojis.sad +
                    'There is no such command as `' +
                    args[0] +
                    '`',
                allowedMentions: { repliedUser: false },
            });
        const embed = new discord_js_1.EmbedBuilder({
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
        if (command.args)
            description += '\n🔹 **Arguments required** : `true`';
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
        if (command.ownerOnly)
            description += '\n🔹 **Bot Owner Only** : `true`';
        embed.setDescription(description);
        // Exemples
        if (command.examples || !command.args) {
            const cmdNames = [...(command.aliases ?? ''), command.name];
            embed.addFields({
                name: '**Examples** :',
                value: `>>> ${command.args ? '' : `\`${client.config.prefix}${command.name}\`\n`}${command.examples?.length
                    ? command.examples
                        .map((e) => '`' +
                        client.config.prefix +
                        cmdNames[~~(Math.random() * cmdNames.length)] +
                        ' ' +
                        e +
                        '`')
                        .join('\n')
                    : ''}`,
            });
        }
        msg.reply({
            embeds: [embed],
            allowedMentions: { repliedUser: false },
        });
    }
}
