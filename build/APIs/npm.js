"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = npmSearch;
const discord_js_1 = require("discord.js");
const search = 'https://registry.npmjs.org/-/v1/search?size=10&text=';
/** Search for npm libs from npm_registry */
async function npmSearch(query) {
    let resp = await fetch(search + encodeURI(query)).then((r) => r.json());
    if (!resp.total)
        throw Error('Any relevant search result not found!');
    const embeds = resp.objects.map((r) => {
        const author = `${r.package.author
            ? `
‣ **Author :** ${r.package.author.username
                ? `[${r.package.author.name}](https://www.npmjs.com/~${r.package.author.username})`
                : r.package.author.name}`
            : ''}
`;
        const publisher = `‣ **Publisher :** [${r.package.publisher.username}](https://www.npmjs.com/~${r.package.publisher.username})
`;
        const large = r.package.maintainers.length > 15 && (r.package.maintainers.length = 15);
        const maintainers = `‣ **Maintainer(s) :** 
${r.package.maintainers
            .map((m) => `​    → [${m.username}](https://www.npmjs.com/~${m.username})`)
            .join('\n')}${large ? '...' : ''}`;
        const keywords = `${r.package.keywords
            ? `
>>> **Keywords :** ${r.package.keywords.join(', ')}`
            : ''}`;
        const scores = `>>> Quality: ${(r.score.detail.quality * 100).toFixed(2)}%
Popularity: ${(r.score.detail.popularity * 100).toFixed(2)}%
Maintenance: ${(r.score.detail.maintenance * 100).toFixed(2)}%
Overall: ${(r.score.final * 100).toFixed(2)}%`;
        return new discord_js_1.EmbedBuilder({
            author: {
                name: 'npm',
                icon_url: 'https://static.npmjs.com/f1786e9b7cba9753ca7b9c40e8b98f67.png',
            },
            color: 0xfa4704,
            title: r.package.name,
            url: r.package.links.npm,
            description: r.package.description,
            fields: [
                {
                    name: 'About :',
                    value: `‣ **Version :** ${r.package.version}
‣ **Last Publish :** <t:${Math.floor(+new Date(r.package.date) / 1000)}:R>${author}${publisher}${maintainers}${keywords}`,
                },
                {
                    name: 'Score: ',
                    value: scores,
                },
            ],
            timestamp: new Date().toISOString(),
        });
    });
    return embeds;
}
/* TODO: addd single package fetch too
const info='https://registry.npmjs.org/';
export async function npmInfo(name:string){
  let resp :typeNpm = await fetch(info+name)
    .then(_=>_.json());
  return [{
    author:{
      name:'npm',
      iconURL:'https://static.npmjs.com/f1786e9b7cba9753ca7b9c40e8b98f67.png'
    },
    title : resp.name,
    description : resp.description,
    color:'#fa4704',
    filelds : [{
      name : 'About :',
      value:`version : ${resp["dist-tags"].latest}\n`
    }]
  }]
}*/
/*
interface typeNpm {
  time : { string : string };
  name : string;
  "dist-tags" : { latest : string } ;
  versions: {
    string : {
      name : string,
      version : string ,
      main: string,
      author : {
        name : string,
      },
      dependencies : {string : string},
    }
  }
  maintainers : {
    name : string,
    email ?: string
  }[];
  description : string;
  homepage : string;
  keywords : string[];
  repository : {
    type : string,
    url : string,
    
  }
  author : { name : string };
}*/
