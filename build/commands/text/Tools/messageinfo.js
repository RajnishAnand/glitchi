"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const _libs_1 = require("#libs");
exports.command = {
    name: 'messageinfo',
    description: 'detailed information about message.',
    aliases: ['minfo', 'mi', 'msginfo'],
    args: false,
    argsHelp: ['?<channelID>', '?<messageID>'],
    roleAccess: 'betaTesters',
    async run({ client, msg, args }) {
        let messageId;
        let channelId;
        // get message & channel ID if has args
        if (args.length) {
            args[0] = args[0].replace(/^<#/, '').replace(/>$/, '');
            if (/^\d+$/.test(args[0])) {
                messageId = args[0];
                if (args.length > 1 && /^\d+$/.test(args[1])) {
                    channelId = messageId;
                    messageId = args[1];
                }
            }
            else
                return msg.reply({
                    content: `${client.config.emojis.knife} are you sure its a valid message ID.`,
                    allowedMentions: { repliedUser: false },
                });
        }
        // has no args but referenced
        else if (msg.reference) {
            channelId = msg.reference.channelId;
            messageId = msg.reference.messageId;
        }
        // warn if forgot to enter messageId
        else {
            return msg.reply({
                content: `${client.config.emojis.aha} looks like you forgot to enter MESSAGE ID.`,
                allowedMentions: { repliedUser: false },
            });
        }
        try {
            const channel = channelId
                ? await msg.client.channels.fetch(channelId)
                : msg.channel;
            if (channel && channel instanceof discord_js_1.TextChannel && messageId) {
                const message = await channel.messages.fetch(messageId);
                (0, _libs_1.createObjectPagination)(msg, (0, _libs_1.messageinfo)(message));
            }
            else {
                msg.reply({
                    content: 'Failed to resolve into TextChannel!',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                });
            }
        }
        catch (_) {
            msg.reply({
                content: 'Failed to resolve message!',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            });
        }
    },
};
