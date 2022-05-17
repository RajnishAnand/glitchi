import {Command} from "Interfaces";

export const command : Command = {
  name : "reload",
  description : "Reload commands",
  devOnly : true,

  async run({msg,args}){ 
    args[0]=args[0]?.toLowerCase();
    if(args[0]=="slashies"||args[0]=="slash"){
      msg.client.loadSlashCommands()
      msg.reply("Successfully Reloaded all SlashCommands.")
    }
    else {
      msg.client.loadCommands()
      msg.reply("Successfully Reloaded all Commands.")
    }
  }
}
