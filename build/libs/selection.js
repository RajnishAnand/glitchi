"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = select;
const discord_js_1 = require("discord.js");
async function select(message, input, filter = (interaction) => interaction.user.id == message.author.id) {
    const id = '' + Date.now() + Math.random();
    const msg = await message.reply({
        content: input.content ?? 'Please select any :',
        components: [
            {
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.StringSelect,
                        options: input.options,
                        placeholder: input.title,
                        customId: id,
                    },
                ],
            },
        ],
        failIfNotExists: false,
    });
    return await msg
        .awaitMessageComponent({
        componentType: discord_js_1.ComponentType.StringSelect,
        time: 60000,
        filter(interaction) {
            return interaction.customId == id && filter(interaction);
        },
    })
        .then((i) => {
        msg.delete();
        return i.values[0];
    })
        .catch(() => {
        msg.delete();
        throw new Error('time out!');
    });
}
