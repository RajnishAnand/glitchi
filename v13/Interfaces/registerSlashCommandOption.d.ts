import {ApplicationCommandDataResolvable} from "discord.js";

export interface RegisterSlashCommandsOption {
  guildId ?: string;
  commands : ApplicationCommandDataResolvable[];
}
