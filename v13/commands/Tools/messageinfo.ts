import { Message, MessageActionRow, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from 'Interfaces'
import { pageView } from '#libs'
import { inspect } from "util";

export const command: Command = {
  name: 'messageinfo',
  description: 'detailed information about message.',
  aliases: ['minfo', 'mi',"msginfo"],
  usage: '?<channelID> <messageID>',
  roleAccess: 'betaTesters',

  async run({ msg, args }) {
    let messageId: string | undefined
    let channelId: string | undefined

    // get message & channel ID if has args
    if (args.length) {
      args[0] = args[0].replace(/^<#/, '').replace(/>$/, '')

      if (/^\d+$/.test(args[0])) {
        messageId = args[0]
        if (args.length > 1 && /^\d+$/.test(args[1])) {
          channelId = messageId
          messageId = args[1]
        }
      } else
        return msg.reply({
          content: `${msg.client.config.emojis.knife} are you sure its a valid message ID.`,
          allowedMentions: { repliedUser: false },
        })
    }

    // has no args but referenced
    else if (msg.reference) {
      channelId = msg.reference.channelId
      messageId = msg.reference.messageId
    }

    // warn if forgot to enter messageId
    else {
      return msg.reply({
        content: `${msg.client.config.emojis.aha} looks like you forgot to enter MESSAGE ID.`,
        allowedMentions: { repliedUser: false },
      })
    }

    try {
      const channel = channelId
        ? await msg.client.channels.fetch(channelId)
        : msg.channel
      if (channel && channel instanceof TextChannel && messageId) {
        const message: Partial<Message>= await channel.messages.fetch(messageId)

        // content
        const content = message.content!.length
          ?inspect(message.content):undefined;
        delete message.content;

        // embed 
        const embeds = message.embeds!.length
          ?inspect(message.embeds):undefined;
        delete message.embeds;
        
        // author 
        const author = inspect(message.author);
        delete message.author;

        const info: MInfo = {
          "OVERVIEW" : inspect(message),
          "AUTHOR": author,
          "CONTENTS": content,
          "EMBEDS": embeds
        };

        new pageView(msg,info)

      } else {
        msg.reply({
          content: 'Failed to resolve into TextChannel!',
          allowedMentions: { repliedUser: false },
          failIfNotExists: false,
        })
      }
    } catch (_) {
      msg.reply({
        content: 'Failed to resolve message!',
        allowedMentions: { repliedUser: false },
        failIfNotExists: false,
      })
    }
  },
}

type MInfo = { [index: string]: string | MessageEmbed[]| undefined}
