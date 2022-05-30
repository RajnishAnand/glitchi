import {MessageEmbed} from "discord.js";
import {embedHandler} from "./embedHandler";
import {stringHandler} from "./stringHandler";

export class objectHandler {
  declare public keys : string[];
  declare private handlers: (stringHandler|embedHandler)[];

  constructor(obj:{[index:string]: string | MessageEmbed[]|undefined}){
    this.keys = Object.keys(obj)
    Object.values(obj).forEach((o,i)=>{
      if(typeof o == "undefined")return this.keys.splice(i,1);
      if(typeof o == 'string'){
        if(!this.handlers?.length)
         this.handlers=[new stringHandler(o,undefined,this.keys[i],undefined,"js")];
        else this.handlers.push(new stringHandler(o,undefined,this.keys[i],undefined,"js"))
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


