import { EmbedBuilder } from '@discordjs/builders';
import { TextCommand } from 'client/interface';
import { TextChannel } from 'discord.js';

export const command: TextCommand = {
  name: 'feedback',
  description: 'Send feedback',
  examples: ['testing feedback command'],
  aliases: ['fd'],
  args: true,
  argsHelp: ['<..feedbackText>'],

  run({ client, msg, args, commandName }) {
    const text = args
      .join(' ')
      //.replace(/\n+/,'\n');
      .replace(/\n{2,}/g, '\n');
    const suggest = commandName == 'suggest';
    const embed = new EmbedBuilder({
      title: `📮| ${suggest ? 'Suggestion' : 'Feedback'} : `,
      color: 0x1ac95d,
      description: '>>> ' + text,
      thumbnail: {
        url: msg.author.displayAvatarURL({
          extension: 'png',
          size: 4096,
        }),
      },
      fields: [
        {
          name: '🥷| Userinfo : ',
          value:
            '```\n' +
            `Username : ${msg.author.tag}\nID : ${msg.author.id}\nGuild : ${msg.guild?.name}` +
            '```',
        },
      ],
      timestamp: new Date().toISOString(),
    });
    //msg.delete();
    (
      msg.client.channels.cache.get(
        suggest
          ? client.config.channels.suggestion
          : client.config.channels.feedback,
      ) as TextChannel
    )
      .send({ embeds: [embed] })
      .then((m) => {
        if (suggest) {
          m.react(client.config.emojis.thumbsup);
          m.react(client.config.emojis.thumbsdown);
        }
      })
      .catch(() => {
        msg.channel.send(
          'There was an error while sending your Feedback! Please inform this to devloper!',
        );
        // this.error(msg,err);
      })
      .then(() => {
        msg.channel.send(
          `Thank you for your ${suggest ? 'Suggestion' : 'Feedback'}! Your ${
            suggest ? 'Suggestion' : 'Feedback'
          } was successfully sent to support server.\😊`,
        );
      });
  },
};
