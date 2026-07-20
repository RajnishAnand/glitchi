"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const _libs_1 = require("#libs");
exports.event = {
    name: 'messageCreate',
    async execute(client, msg) {
        let val = await (0, _libs_1.messageHandler)(client, msg);
        if (!val)
            return;
        if ('error' in val)
            return msg
                .reply({
                embeds: [
                    {
                        description: val.message,
                        color: 0xfcc300,
                        footer: {
                            text: val.command?.name
                                ? val.command.name + ': ' + val.error
                                : val.error,
                        },
                    },
                ],
            })
                .then((m) => (0, _libs_1.attachDeletable)(m, msg.author.id));
        try {
            val.command.run(val.args);
        }
        catch (err) {
            msg.reply({
                embeds: [
                    {
                        title: 'Error',
                        description: 'Failed to execute this command!',
                        // TODO: add to error log
                    },
                ],
            });
        }
    },
};
