import fetch from 'node-fetch';
import {MessageEmbed} from 'discord.js';
import {unsplashApi} from '#types/unsplash-api';

const url = 'https://api.unsplash.com/search/photos?content_filter=high&client_id=' + process.env.UNSPLASH;

export default async function (query : string){
  let resp :unsplashApi = await fetch(url+'&query='+encodeURI(query))
    .then(r=>r.json());
  
  return resp.results.map(o=>{
    return new MessageEmbed({
      author:{
        name : 'Unsplash',
        icon_url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_Unsplash.svg/512px-Logo_of_Unsplash.svg.png',
      },
      color : '#000000',
      title : '',
      description : o.description??'',
      image : {
        url : o.urls.raw
      }
    })
  });
}


