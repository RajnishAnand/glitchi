"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const discord_js_1 = require("discord.js");
class Pagination {
    constructor(refMsg, views, options) {
        if (!views.length)
            throw new Error('Pagination requires at least one view.');
        this.refMsg = refMsg;
        this.views = views;
        this.viewIndex = options?.initialView ?? 0;
        const userSnowflake = this.refMsg instanceof discord_js_1.Message ? this.refMsg.author.id : this.refMsg.user.id;
        this.filter = options?.filter ?? ((i) => i.user.id === userSnowflake);
        if (options?.initialPage) {
            // negative initialPage counts back from the last page (-1 = last, -2 = second-to-last)
            this.page =
                options.initialPage < 0
                    ? this.length + options.initialPage + 1
                    : options.initialPage;
        }
        (this.refMsg instanceof discord_js_1.Message
            ? this.refMsg.reply(this.value)
            : this.refMsg.reply({ ...this.value, ephemeral: options?.ephemeral, fetchReply: true })).then((m) => {
            if (m instanceof discord_js_1.Message)
                this.msg = m;
            this.init();
        });
    }
    get provider() {
        return this.views[this.viewIndex].provider;
    }
    get currentProvider() {
        return this.provider;
    }
    get page() {
        return this.provider.page;
    }
    set page(x) {
        this.provider.page = x > 0 && x < this.length + 1 ? x : this.page;
    }
    get length() {
        return this.provider.length;
    }
    get value() {
        const payload = this.provider.render();
        return {
            content: payload.content ?? '',
            embeds: payload.embeds ?? [],
            components: this.buildComponents(),
        };
    }
    get invalidClickWarning() {
        return [
            "Don't click! <:youBad:888716976145461249>.",
            "Don't click! <:youBad:888716976145461249>, I'll ban you!",
            'Eat this chocolate Instead! 🍫',
            "Nope, I'm not responding to you!,👻",
        ][Math.floor(Math.random() * 4)];
    }
    async delete() {
        return this.refMsg instanceof discord_js_1.Message ? this.msg?.delete() : this.refMsg.deleteReply();
    }
    async refresh(opts) {
        if (!this.msg)
            return;
        if (opts?.jumpToLastPage)
            this.page = this.length;
        await this.msg.edit(this.value).catch(() => { });
    }
    async goto(interaction) {
        await interaction.showModal({
            title: `Jump to Page [40seconds]`,
            customId: 'goto',
            components: [
                {
                    type: discord_js_1.ComponentType.ActionRow,
                    components: [
                        {
                            type: discord_js_1.ComponentType.TextInput,
                            label: `Enter page you wanna jump to: [1-${this.length}].`,
                            customId: 'topage',
                            style: discord_js_1.TextInputStyle.Short,
                            required: true,
                            minLength: 1,
                            maxLength: this.length.toString().length,
                            placeholder: 'Index of Page. eg,(1)',
                        },
                    ],
                },
            ],
        });
        interaction
            .awaitModalSubmit({
            filter: (x) => +x.fields.getTextInputValue('topage') > 0 &&
                +x.fields.getTextInputValue('topage') < this.length + 1,
            time: 40000,
        })
            .then((i) => {
            this.page = +i.fields.getTextInputValue('topage');
            if (i.isFromMessage())
                i.update(this.value);
        })
            .catch(() => { });
    }
    buildComponents(disabled) {
        const client = this.refMsg.client;
        const rows = [
            {
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.Button,
                        style: discord_js_1.ButtonStyle.Secondary,
                        emoji: client.config.emojis.leftArrow,
                        customId: 'left',
                        disabled: disabled ?? (this.page == 1 || this.length == 1),
                    },
                    {
                        type: discord_js_1.ComponentType.Button,
                        label: `${this.page} of ${this.length}`,
                        style: discord_js_1.ButtonStyle.Primary,
                        customId: 'page',
                        emoji: '📑',
                        disabled: disabled ?? this.length < 3,
                    },
                    {
                        type: discord_js_1.ComponentType.Button,
                        style: discord_js_1.ButtonStyle.Secondary,
                        emoji: client.config.emojis.rightArrow,
                        customId: 'right',
                        disabled: disabled ?? (this.length == 1 || this.page == this.length),
                    },
                    {
                        type: discord_js_1.ComponentType.Button,
                        style: discord_js_1.ButtonStyle.Secondary,
                        emoji: client.config.emojis.cross,
                        customId: 'delete',
                        disabled,
                    },
                ],
            },
        ];
        if (this.views.length > 1) {
            rows.push({
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.StringSelect,
                        customId: 'select',
                        disabled,
                        options: this.views.map((v, i) => ({
                            label: v.title ?? `View ${i + 1}`,
                            value: i.toString(),
                            description: v.description,
                            emoji: v.emoji,
                            default: i == this.viewIndex,
                        })),
                    },
                ],
            });
        }
        return rows;
    }
    async init() {
        if (!this.msg)
            return;
        const collector = this.msg.createMessageComponentCollector({
            idle: 120000,
            dispose: true,
        });
        collector.on('collect', async (interaction) => {
            if (!this.filter(interaction)) {
                interaction.reply({ ephemeral: true, content: this.invalidClickWarning });
                return;
            }
            switch (interaction.customId) {
                case 'left':
                    this.page--;
                    break;
                case 'right':
                    this.page++;
                    break;
                case 'page':
                    this.goto(interaction);
                    return; // goto handles its own reply via modal; don't fall through to interaction.update
                case 'delete':
                    await this.delete().catch(() => { });
                    return;
                case 'select':
                    this.viewIndex = +interaction.values[0];
                    break;
            }
            interaction.update(this.value).catch(() => { });
        });
        collector.on('end', () => {
            this.msg?.edit({ components: this.buildComponents(true) }).catch(() => { });
        });
    }
}
exports.Pagination = Pagination;
