import formatCode, { formats } from '#api/formatCode.js';
import { stringPagination } from '#libs';
import { CBParser } from 'cbparser';
import { Message } from 'discord.js';
import { SlashCommand } from 'Interfaces';

export const command: SlashCommand = {
  name: 'format',
  type: 'MESSAGE',
  async run({ interaction }) {
    const block = CBParser(interaction.targetMessage.content)[0] ?? undefined;
    if (!block)
      return interaction.reply({
        content: "Requested message dosen't contain any codeblocks.",
        ephemeral: true,
      });

    const descriptions = [
      'C language like syntaxes like c, cpp, js, ...',
      'For Formatting Rust Code',
      'For Formatting GoLang Code',
      'For Formatting Dart Code',
    ];

    const msg = (await interaction.reply({
      content: 'Please select format type and style.',
      components: [
        {
          type: 'ACTION_ROW',
          components: [
            {
              type: 'SELECT_MENU',
              customId: 'format',
              options: formats.map((e, i) => ({
                label: e,
                value: e,
                description: descriptions[i],
              })),
            },
          ],
        },
      ],
      fetchReply: true,
      ephemeral: true,
    })) as Message;
    const { value, i } = await msg
      .awaitMessageComponent({
        componentType: 'SELECT_MENU',
        time: 120000,
      })
      .then((i) => ({ value: i.values[0], i }))
      .catch(() => ({ value: false, i: undefined }));

    if (!value || !i) return;

    try {
      const formattedCode = await formatCode(value as typeof formats[number], {
        base: 'Google',
        source: block.code,
        tabWidth: 2,
        useSpaces: true,
      });

      new stringPagination(i as unknown as typeof interaction, formattedCode, {
        decoration: { lang: block.lang, title: 'Godbolt[clangformat]' },
      });
    } catch (_) {
      return interaction.reply({
        content: 'Unknown Error Occured while formatting requested codeblock.',
        ephemeral: true,
      });
    }
  },
};
