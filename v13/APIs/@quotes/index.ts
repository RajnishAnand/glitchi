import fetch from "node-fetch";
import {QuoteRoutes, RandomFilterOptions, RandomResponse} from "./types";

// TODO: add more field and Options

export class quote {
  /** API URL */
  private url='https://api.quotable.io/random';

  /** returns a single Quote */
  public async random(filters?:RandomFilterOptions){
    let options :string|undefined;
    if(filters)options= `?${
      filters.author?`author=${encodeURI(filters.author)}&`:''
    }${
      filters.maxLength?`maxLength=${filters.maxLength}&`:''
    }${
      filters.minLength?`minLength=${filters.minLength}&`:''
    }${
      filters.tag.tags.length?`tags=${
        filters.tag.tags.join(filters.tag.required?',':'|')
      }`:''
    }`;

    const resp: RandomResponse|{}= await this.fetch("random",options);
    if(!('_id' in resp))return 'Not Found';
    return this.decorate(resp);
  }

  private async fetch(route:QuoteRoutes,options:string=''){
    return await fetch(`${this.url}/${route}${options}`)
      .then(r=>r.json())
  }

  private decorate(d:RandomResponse){
    return `\`\`\`js
  content: '❝ ${d.content} ❞',
  author: '✐ ${d.author}',
  tags: ${JSON.stringify(d.tags)},
  id: '${d._id}',
\`\`\``
  }
}



