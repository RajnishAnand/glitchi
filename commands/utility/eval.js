const util = require('util');
const config = require('../../config.json');
module.exports = {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  async execute({ msg,args,content,error, prefix }, client = msg.client) {
    try {
      if (msg.author.id === config.ownerId) {
        this.send(eval(content),msg);
      }
      else {
        msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err) {
      msg.channel.send(err.message, { code: true });
    };

  },
  debug(evaled) {
    try {
      //console.log(type);
      if (typeof(evaled) === 'string') {
        evaled = evaled
          .replace(/</g, '<​')
          .replace(/`/g, '`​');
      }
      return util.inspect(evaled);
    }
    catch (err) {
      return err.message;
    }
  },
  async send (txt,msg) {
    if(!msg)return;
    txt = this.debug(txt);
    let evArr = [];
    const evLength = txt.length;

    for (let i = 0; i < evLength; i += 700) {
      evArr.push(txt.substr(i, 700));
    }
    delete txt;
    let page = 0;

    const infoM = await msg.channel.send(`\` ${page+1}/${evArr.length}m|${evLength}ch \``);
    const mssg = await msg.channel.send(evArr[0], {
      code: 'javascript',
    });

    mssg.awaitReactions(async (react, user) => {
      const nav = ['◀️', '🗑️', '▶️'];
      if (user.id == msg.author.id && nav.includes(react.emoji.name)) {
        let pgChange = nav
          .indexOf(react.emoji.name) - 1;
        if (!pgChange) {
          mssg.delete();
          infoM.edit(`\` ${evArr.length}m|${evLength
            }ch \``)
        }
        else if (pgChange + page >= 0 && pgChange + page < evArr.length) {
          page += pgChange;
          infoM.edit(`\` ${page+1
            }/${evArr.length
            }m|${evLength
            }ch \``);
          mssg.edit(evArr[page], {
            code: 'javascript',
          });

        };

        try { await react.users.remove(msg.author.id); }
        catch (err) {};
      }
      else return false;
    }, { max: 9999, time: 120000, erros: ['time'] });

    if (evArr.length - 1) await mssg.react('◀️');
    await mssg.react('🗑️');
    if (evArr.length - 1) await mssg.react('▶️');

    setTimeout(() => {
      mssg.reactions.removeAll().catch();
    }, 120000);
  }
}