import {MessageEmbed} from "discord.js";
import {embedHandler} from "./embedHandler";
import {stringHandler} from "./stringHandler";

export class objectHandler {
  declare public keys : string[];
  declare private handlers: (stringHandler|embedHandler)[];

  constructor(obj:{[index:string]: string | MessageEmbed[]}){
    this.keys = Object.keys(obj)
    Object.values(obj).forEach((o)=>{
      if(typeof o=='string'){
        if(!this.handlers?.length)
         this.handlers=[new stringHandler(o)];
        else this.handlers.push(new stringHandler(o))
      }
      else {
         if(!this.handlers?.length)
           this.handlers = [new embedHandler(o)];
         else this.handlers.push(new embedHandler(o))
      }
    });
  }
  value(n:number){
    return this.handlers[n];
  }
}


