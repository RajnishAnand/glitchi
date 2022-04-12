import {Command} from "Interfaces";
import {VM, } from "vm2";
import {Canvas, Image} from 'skia-canvas';
import { pageView ,codeBlockParser} from "#libs";
import { inspect } from "util";


export const command: Command = {
  name : "canv",
  description: "canvas sandbox",
  usage: "<code...>",
  aliases: ["canvas","draw"],
  args: true,
  roleAccess: "betaTesters",

  async run({msg,args,content}){

    if(args[0].toLowerCase()=="--cheatsheet"){
      return msg.reply({
        embeds: [{
          title: "Cheatsheet",
          color: "#00bfff",
          url: "http://www.cheat-sheets.org",
          description: "Canvas Cheatsheet Preview: ",
          image: {
            url: "http://www.cheat-sheets.org/saved-copy/HTML5_Canvas_Cheat_Sheet.png",
          }
        }],
        components: [{
          type: "ACTION_ROW",
          components: [
            {
              style: "LINK",
              label: "PDF",
              type: "BUTTON",
              url: "https://cdn.discordapp.com/attachments/864517432026333184/864518194445287454/HTML5_Canvas_Cheat_Sheet.pdf"
            },
            {
              style: "LINK",
              label: "PNG",
              type: "BUTTON",
              url: "http://www.cheat-sheets.org/saved-copy/HTML5_Canvas_Cheat_Sheet.png"
            }
          ]
        }],
        allowedMentions: {repliedUser: false},
        failIfNotExists: false,
      });
    };
    
    const vm = new VM({
      sandbox: {Canvas,Image},
      eval: false,
      wasm: false,
      timeout: 6000,
      fixAsync: false,
      compiler: "javascript"
    });
    const process= {env : {TOKEN: "never gonna give you up never gonna let you down never gonnna turn arnound and desert you."}};
    vm.freeze(process,'process');
    
    try{
      let code= content();
      code = codeBlockParser(code).code??code;

      const canv:Canvas = await vm.run(wrap(code));
      const img = await canv.toBuffer("png");

       msg.reply({
         content: "Canvas Output: :frame_photo:",
         files: [img],
         allowedMentions:{repliedUser:false},
         failIfNotExists:false,
       })
    }catch(e){
      new pageView(msg,inspect(e),{
        code: "js",
        title: "Canvas[Error]"
      })
    }
  }
}

function wrap(txt:string){
  return `"use strict";
  let canvas = new Canvas(600, 600);
  ${txt}
  canvas;`;
}
