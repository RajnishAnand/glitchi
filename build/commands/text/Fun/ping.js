"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
exports.command = {
    name: 'ping',
    description: 'bot latency and heartbeat',
    args: false,
    run({ client, msg }) {
        msg.channel
            .send(`pong!`)
            .then((sent) => sent.edit(`${client.config.emojis.dance} | Pong! | Heartbeat : ${msg.client.ws.ping}ms | Roundtrip latency : ${sent.createdTimestamp - msg.createdTimestamp}ms.`));
    },
};
