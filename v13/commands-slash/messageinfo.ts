import { pageView } from "#libs";
import { SlashCommand } from "Interfaces";

export const command: SlashCommand = {
  name: "messageinfo",
  type: "MESSAGE",

  run({interaction}){
    try{
      const data = (interaction.client.commands
        .get("messageinfo") as any)
        ?.main?.(interaction.targetMessage);
      new pageView(interaction,data);
    } 
    catch(_){}
  }
}
