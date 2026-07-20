"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: 'clientReady',
    once: true,
    execute(client) {
        client.user?.setStatus('idle');
        if (!process.env.BETA)
            client.updateStatus();
        delete process.env.TOKEN;
        console.log('logged in as', client.user.tag);
    },
};
