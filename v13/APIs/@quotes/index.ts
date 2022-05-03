import fetch from "node-fetch";
import {MessageEmbed} from 'discord.js';
import {QuoteRoutes, RandomFilterOptions, QuoteResponse, ErrorResponse} from "./types";

/** API URL */
const URL='https://api.quotable.io';

/** Returns (a Quote or Error) as MessageEmbed */
async function randomQuote(filters?:RandomFilterOptions){
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

  const resp: QuoteResponse|ErrorResponse= await fetchit("random",options);
  return {
    value : resp,
    embedify(){return decorate(this.value)}
  };
}

/** Returns a Quote with id if found else error message*/
async function quoteById(id:string):Promise<MessageEmbed>{
  return decorate((await fetchit("quotes",'/'+id) as QuoteResponse));
}


// TODO: add more field and Options


/////////////// Helper functions ////////////

async function fetchit(route:QuoteRoutes,options:string=''){
  return await fetch(`${URL}/${route}${options}`)
    .then(r=>r.json())
}

/** decorates a QuoteResponse or ErrorResponse into an embed*/
function decorate(d:QuoteResponse|ErrorResponse){
  if(!("_id" in d)) return new MessageEmbed({
    color: "#ff5500",
    author: {
      name : "Quotable: ",
      url : URL
    },
    description:`\`\`\`js\n${JSON.stringify(d,null,'  ')} \`\`\``
  });

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

///// exportings ////
export {randomQuote,quoteById};
