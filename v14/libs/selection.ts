import { Message, Interaction, ComponentType } from 'discord.js';

export default async function select(
  message: Message,
  input: SelectionType,
  filter: (interaction: Interaction) => boolean = (interaction) =>
    interaction.user.id == message.author.id,
) {
  const id = '' + Date.now() + Math.random();

  const msg = await message.reply({
    content: input.content ?? 'Please select any :',
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            options: input.options,
            placeholder: input.title,
            customId: id,
          },
        ],
      },
    ],
    failIfNotExists: false,
  });
  return await msg
    .awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      time: 60000,
      filter(interaction) {
        return interaction.customId == id && filter(interaction);
      },
    })
    .then((i) => {
      msg.delete();
      return i.values[0];
    })
    .catch(() => {
      msg.delete();
      throw new Error('time out!');
    });
}

type SelectionType = {
  title: string;
  content?: string;
  options: {
    label: string;
    description?: string;
    value: string;
    emoji?: string;
  }[];
};
