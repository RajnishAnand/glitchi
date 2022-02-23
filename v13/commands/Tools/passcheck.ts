import { rockYou } from "#api/rockyou.js";
import { Command } from "Interfaces";

export const command: Command = {
  name: "passcheck",
  description: "checks if text is on dictionary attack list",
  args: true,
  async run({msg,content}){
    msg.reply({
      embeds: [await rockYou(content())],
      allowedMentions: {
        repliedUser: false
      }
    });
  }
}
