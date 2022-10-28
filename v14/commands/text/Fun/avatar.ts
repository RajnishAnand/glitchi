import { findUser } from '#libs';
import { TextCommand } from 'client/interface';
import { Guild, User } from 'discord.js';

export const command: TextCommand = {
  name: 'avatar',
  aliases: ['pfp', 'a'],
  description: 'User Avatar',
  args: false,
  argsHelp: ['?<@user||userID>'],

  async run({ client, msg, args, content }) {
    let user: User | undefined;
    if (!args.length) user = msg.author;
    else {
      args[0] = args[0].replace(/^<@!?/, '').replace(/>$/, '');

      // is valid user
      if (!/^\d*$/.test(args[0])) {
        const u = await findUser(msg.guild as Guild, content());
        if (u) user = u.user;
        else
          msg.reply(
            'Specified User not found in this guild. Try Using userID instead.',
          );
      } else {
        await msg.client.users
          .fetch(args[0])
          .then((u) => {
            user = u;
          })
          .catch(() => {
            msg
              .reply(
                `User with id \`${args[0]}\` not Found! ${client.config.emojis.go}`,
              )
              .catch(() => {});
          });
      }
    }

    // send embed
    if (user) {
      msg
        .reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            {
              color: 0x2f3136,
              title: user.tag,
              url: user.displayAvatarURL({
                extension: 'png',
                size: 4096,
              }),
              image: {
                url: user.displayAvatarURL({
                  extension: 'png',
                  size: 4096,
                }),
              },
              footer: {
                text: `Requested by ${msg.author.tag}`,
                icon_url: msg.author.avatarURL() ?? undefined,
              },
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .catch(() => {});
    }
  },
};
