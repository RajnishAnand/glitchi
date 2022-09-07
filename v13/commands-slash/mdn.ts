import { SlashCommand } from 'Interfaces';
import mdnApi from '../APIs/mdn';

export const command: SlashCommand = {
  name: 'mdn',
  description: 'Search from mdn docs',
  options: [
    {
      name: 'query',
      description: 'text to query for :',
      type: 'STRING',
      required: true,
      autocomplete: true,
    },
    {
      name: 'ephemeral',
      description: 'Set to ephemeral to make it visible only to you.',
      type: 'BOOLEAN',
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
              type: 'ACTION_ROW',
              components: [
                {
                  type: 'BUTTON',
                  style: 'LINK',
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
