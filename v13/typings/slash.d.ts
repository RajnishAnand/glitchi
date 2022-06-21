import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

interface slashCmnds {
  data: SlashCommandBuilder;
  run: (interaction: Interaction) => null;
}

export { slashCmnds };
