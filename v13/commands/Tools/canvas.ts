import {Command} from "Interfaces";
import {VM} from "vm2";
import {Canvas} from 'skia-canvas';
import { pageView ,codeBlockParser} from "#libs";
import { inspect } from "util";


export const command: Command = {
  name : "canv",
  description: "canvas sandbox",
  aliases: ["canvas","draw"],
  args: true,
  devOnly:false,
  async run({msg,content}){
    const vm = new VM({
      sandbox: {Canvas},
      eval: false,
      wasm: false,
      timeout: 6000,
      fixAsync:true,
      compiler: "javascript"
    });

    try{
      let code= content();
      code = codeBlockParser(code).code??code;

      const canv:Canvas = vm.run(wrap(code));
      const img = await canv.toBuffer("png");

       msg.reply({
         content: "Img : ",
         files: [img],
         allowedMentions:{repliedUser:false},
         failIfNotExists:false,
       })
    }catch(e){
      new pageView(msg,inspect(e))
    }
  }
}

function wrap(  txt:string){
  return `"use strict";
  let canvas = new Canvas(600, 600);
  ${txt}
  canvas;`;
}
