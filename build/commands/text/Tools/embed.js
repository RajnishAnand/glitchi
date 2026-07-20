"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const _libs_1 = require("#libs");
const cbparser_1 = require("cbparser");
const discord_js_1 = require("discord.js");
exports.command = {
    name: 'embed',
    description: 'convert your json-code to Embed',
    args: true,
    argsHelp: ['...<json-Embed>'],
    run({ msg, content }) {
        let txt = content().replace(/[­ ]/g, '');
        txt = (0, cbparser_1.CBParser)(txt)[0]?.code.replaceAll('\\`', '`') ?? txt;
        try {
            let obj = JSON.parse(txt);
            let embeds;
            if (Array.isArray(obj))
                embeds = obj.map((e) => new discord_js_1.EmbedBuilder(e));
            else
                embeds = [new discord_js_1.EmbedBuilder(obj)];
            // if (!Array.isArray(obj))
            msg
                .reply({
                embeds,
                allowedMentions: { repliedUser: false },
            })
                .then((m) => (0, _libs_1.attachDeletable)(m, msg.author.id))
                .catch((e) => {
                const errorMessage = typeof e == 'string'
                    ? e
                    : typeof e?.message == 'string'
                        ? e.message
                        : 'Unknown Error';
                (0, _libs_1.createStringPagination)(msg, e.message, {
                    decoration: { lang: 'js', title: 'EmbedError' },
                });
            });
        }
        catch (err) {
            (0, _libs_1.createStringPagination)(msg, err.message, {
                decoration: { lang: 'JSON_ERROR' },
            });
        }
        //msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a  **"code-block"**');
    },
};
