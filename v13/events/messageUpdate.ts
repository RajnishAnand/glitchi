// import { messageHandler } from '#libs';
// import { MessageOptions, MessagePayload } from 'discord.js';
import { Event, ExtendMessage } from 'Interfaces';

export const event: Event = {
  name: 'messageUpdate',
  async execute(client, _, msg: ExtendMessage) {
    client.events.get('messageCreate')?.execute(client, msg);
    // const {editables} = client.config;
    // const neu = await messageHandler(client,msg);
    // const old = await messageHandler(client,oldMsg);
    //
    // if(!neu || !old) return;
    // if(!(msg.id in editables))return;
    //
    // // edit for editable commands
    // async function edit(k:MessageOptions){
    //   clearTimeout(editables[msg.id].timeout);
    //   const payload = new MessagePayload(msg,k)
    //
    //   const m = await msg.channel.messages.fetch(editables[msg.id].messageId)
    //     // .then(mm=>mm.edit({content:"­",embeds:[],components:[]}))
    //     .then(mm=>mm.edit(payload))
    //
    //   client.config.editables[msg.id].timeout = setTimeout(()=>{
    //       delete client.config.editables[msg.id]
    //   },120000)
    //   return m;
    // }
    //
    //
    // if ("error" in neu) if(neu.command?.editable && old.command?.name==neu.command.name)
    //   return edit({
    //     embeds: [{
    //       title : "errrrrrr on edit"
    //     }]
    //   })
    //
    // if(old.command.editable){
    //   if(neu.command.name != old.command.name){
    //     clearTimeout(editables[msg.id].timeout);
    //     delete editables[msg.id];
    //   }
    //
    //   try{
    //     neu.command.run({...neu.data,async reply(k){
    //               }})
    //   }
    //   catch(e:any){
    //     if(e?.message)
    //       msg.reply(e.message).catch(()=>{})
    //   }
    // }
  },
};
