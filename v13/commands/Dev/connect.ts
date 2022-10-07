import { Message, MessageCollector, TextChannel } from 'discord.js';
import { Command, CommandArgument } from 'Interfaces';
//import pageView from '../../libs/pagination/index';

export const command: Command = {
  name: 'connect',
  description: 'connect to a channel.',
  aliases: ['msg'],
  args: true,
  // usage : string,
  // permissions : string,
  devOnly: true,
  // permRequired : [string],
  run,
};

async function run({ msg, args, content }: CommandArgument) {
  const id = args[0].replace(/^<#/, '').replace(/>$/, '');
  const channel = await msg.client.channels
    .fetch(id)
    .catch((err: any) => msg.reply(err.message));

  if (!channel || !(channel instanceof TextChannel))
    return msg.reply('Channel is not a TextChannel!');

  if (args[1] !== 'start') {
    let contents = content().replace(args[0], '');
    if (contents.replace(/\s+/g, '') != '') return channel.send(contents);
    // else channel.send('This Channel is Directly Connected to my Devloper.');
  }
  if (msg.channel.id in msg.client.config.block)
    return msg.reply('This channel is already connected to a channel!');
  const collector0: MessageCollector = channel.createMessageCollector({
    filter: (m) => m.author?.id != msg.client.user?.id,
  });

  collector0.on('collect', async (m) => {
    try {
      if (msg.channel.type != 'GUILD_TEXT') return;
      const webhooks = await msg.channel.fetchWebhooks();
      const webhook = webhooks.first();
      if (!webhook) {
        msg.channel.send({
          content: m.content,
          embeds: m.embeds,
          attachments: m.attachments as any,
          components: m.components,
          stickers: m.stickers as any,
        });
      }

      if (webhook) {
        await webhook.send({
          content: m.content == '' ? undefined : m.content,
          username: m.author.username,
          avatarURL: m.author.avatarURL() ?? '',
          embeds: m.embeds,
        });
      }
    } catch (error) {
      console.error('Error trying to send a message: ', error);
    }
  });

  const collector1: MessageCollector = msg.channel.createMessageCollector({
    filter: (m: Message) => m.author?.id == msg.author.id,
  });

  collector1.on('collect', (m) => {
    if (m.content == '-s' || m.content == '--stop') return collector1.stop();

    channel.send({
      content: m.content,
      embeds: m.embeds,
      attachments: m.attachments as any,
      components: m.components,
      stickers: m.stickers as any,
    });
  });

  collector1.on('end', () => {
    collector0.stop();
    delete msg.client.config.block[msg.channel.id];
    msg.channel.send('Channel disconnected!');
    // channel.send('Channel disconnected!');
  });

  msg.client.config.block[msg.channel.id] = msg.author.id;
  msg.reply(`Connected to channel <#${id}>. Use '-s' to stop`);
}
