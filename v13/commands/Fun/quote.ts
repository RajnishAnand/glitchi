import {Command} from 'Interfaces';
import {quoteById,randomQuote} from '../../APIs/@quotes';

export const command: Command ={
  name: "quote",
  aliases: ["quotable"],
  description: "Get quotes from qoutable API",
  async run({msg, args}){
    // (default) random quote 
    if(!args.length||args[0].toLowerCase()=="random") 
      return msg.reply({
        embeds : [(await randomQuote()).embedify()],
        allowedMentions:{
          repliedUser:false
        }
      });

    // Quote with a specific id
    msg.reply({
      embeds: [await quoteById(args[0])],
      allowedMentions: {
        repliedUser: false
      }
    })
  }
}
