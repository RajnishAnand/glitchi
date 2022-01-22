import {owoify} from "#libs";
import {Command} from "Interfaces";

export const command : Command={
  name : "owoify",
  description : "convert to text to owoLang",
  aliases : ["owo"],
  args : true,
  examples : ["hello"],

  run({msg,content}){
    msg.reply(owoify(content()))
  }
}
