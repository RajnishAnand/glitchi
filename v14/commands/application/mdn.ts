import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from 'discord.js';
import { ApplicationCommand } from 'client/interface';
import mdnApi from '#api/mdn.js';

export const command: ApplicationCommand = {
  name: 'mdn',
  description: 'Search from mdn docs',
  global: true,
  options: [
    {
      name: 'query',
      description: 'text to query for :',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'ephemeral',
      description: 'Set to ephemeral to make it visible only to you.',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  run({ client, interaction }) {
    const q = interaction.options.getString('query') as string;
    mdnApi(q)
      .then((response) => {
        interaction.reply({
          ephemeral: interaction.options.getBoolean('ephemeral') || false,
          embeds: [response[0].embedify()],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Link,
                  url: response[0].value.mdn_url,
                  label: 'Open in Browser',
                },
              ],
            },
          ],
        });
      })
      .catch(() => {
        interaction.reply({
          content:
            client.config.emojis.sad + ' Any relevant search result not found!',
          ephemeral: true,
        });
      });
  },

  async autocompleteRun({ interaction }) {
    const q = interaction.options.getString('query') as string;
    const resp = await mdnApi(q)
      .then((r) =>
        r.map((e) => ({
          name: e.value.title,
          value: e.value.title,
        })),
      )
      .catch(() => []);

    interaction.respond(resp.slice(0, 25)).catch(() => {});
  },
};
