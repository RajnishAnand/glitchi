import fetch from "node-fetch";
import {MessageEmbed} from 'discord.js';
import {RandomFilterOptions, QuoteResponse, ErrorResponse} from "./types";

/** API URL */
const URL='https://api.quotable.io';


/** Returns (a Quote or Error) as MessageEmbed */
export async function randomQuote(filters?:RandomFilterOptions){
  let options :string|undefined;
  if(filters)options= `?${
    filters.author?`author=${encodeURI(filters.author)}&`:''
  }${
    filters.maxLength?`maxLength=${filters.maxLength}&`:''
  }${
    filters.minLength?`minLength=${filters.minLength}&`:''
  }${
    filters.tags?`tags=${encodeURI(filters.tags)}`:''
  }`;

  const value: QuoteResponse|ErrorResponse= await fetch(`${URL}/random/${options}`).then(r=>r.json());
  if(!("_id" in value)) throw new Error(value.statusMessage);
  return {
    value,
    embedify(){return decorate(this.value)}
  };
}


/** Returns a Quote with id if found else error message*/
export async function quoteById(id:string){
  const value:QuoteResponse|ErrorResponse = await fetch(`${URL}/quotes/${id}`).then(r=>r.json());
  if(!("_id" in value)) throw new Error(value.statusMessage);
  
  return {
    value,
    embedify(){return decorate(this.value)}
  }
}


/** decorates a QuoteResponse or ErrorResponse into an embed*/
function decorate(d:QuoteResponse):MessageEmbed{
  return new MessageEmbed({
    color: "#fcc300",
    author: {
      name: "Quotable: ",
      url: URL
    },
    description: `> ❝ **${d.content}** ❞
    ✐ ${d.author}`,
    fields: [{
      name: 'Tags :',
      value: `> ${d.tags}`,
      inline: false
    }],
    footer:{
      text: `id: ${d._id}`
    }
  })
}

