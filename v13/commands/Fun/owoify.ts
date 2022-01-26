import {owoify} from "#libs";
import {Command} from "Interfaces";

export const command : Command={
  name : "owoify",
  description : "convert to text to owoLang",
  aliases : ["owo"],
  args : true,
  examples : ["hello"],

  run({msg,commandName}){
    msg.reply(owoify(
      msg.cleanContent
        .replace(/^[\s+]?/, "")
        .replace(commandName + ' ', '')
    ))
  }
}
