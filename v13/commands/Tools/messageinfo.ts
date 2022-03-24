import { MessageEmbed, TextChannel } from "discord.js";
import { Command } from "Interfaces";
import {pageView} from "#libs";

export const command:Command = {
  name: "messageinfo",
  description: "detailed information about message.",
  aliases: ["minfo","mi"],
  usage: "?<channelID> <messageID>",
  roleAccess: 'betaTesters',
  
  async run({msg,args}){
    let messageId: string|undefined;
    let channelId: string|undefined;

    // get message & channel ID if has args
    if(args.length){
      args[0] = args[0]
        .replace(/^<#/, '')
        .replace(/>$/, '');

      if(/^\d+$/.test(args[0])){
        messageId= args[0];
        if(args.length>1 && /^\d+$/.test(args[1])){
          channelId= messageId;
          messageId= args[1];
        }
      }
      else return msg.reply({
        content: `${msg.client.config.emojis.knife} are you sure its a valid message ID.`,
        allowedMentions: {repliedUser: false}
      })
    }

    // has no args but referenced
    else if(msg.reference){
      channelId= msg.reference.channelId;
      messageId= msg.reference.messageId;
    }
    
    // warn if forgot to enter messageId
    else{
      return msg.reply({
        content: `${msg.client.config.emojis.aha} looks like you forgot to enter MESSAGE ID.`,
        allowedMentions: {repliedUser: false}
      })
    }

    try{
      const channel = channelId
        ?await msg.client.channels.fetch(channelId)
        :msg.channel;
      if(channel
      && (channel instanceof TextChannel)
      && messageId){
        const message = await channel.messages
          .fetch(messageId);
        const info: MInfo = {
          details: [new MessageEmbed({
            color: "#00bfff",
            title: "Message Details",
            description: `> Id: ${message.id}\n> Channel Id: ${message.channel.id}\n> Guild Id: ${message.guild?.id}\nCreated Timestamp: <t:${(message.createdTimestamp/1000).toFixed(0)}>\nType: ${message.type}\nSystem: ${message.system}\nAuthor Id: ${message.author.id}\nPinned: ${message.pinned}/ntts: ${message.tts}\nWebhook Id: ${message.webhookId}\nGroup Activity Application: ${message.groupActivityApplication}\nApplication Id: ${message.applicationId}\nReferance: ${message.reference?`[${message.reference.messageId}](https://discord.com/channels/${message.reference.guildId}/${message.reference.channelId}/${message.reference.messageId})`:"null"}`
          })]

        }
        
        new pageView(msg,info);
      }
      else{
        msg.reply({
          content: "Failed to resolve into TextChannel!",
          allowedMentions: {repliedUser: false},
          failIfNotExists: false
        })
      }
    }
    catch (_){
      msg.reply({
        content: "Failed to resolve message!",
        allowedMentions: {repliedUser: false},
        failIfNotExists: false
      })
    }
  }
}

type MInfo = {[index:string]: string|MessageEmbed[]};
