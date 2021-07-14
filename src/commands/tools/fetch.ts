import fetch from 'node-fetch';
import conf from '../../config.js';

module.exports = {
  name : 'fetch',
  description : 'To fetch any URL.',
  usage : '[url]',
  args : true ,
  execute({msg,args}:any){
    fetchit(
      args[0],
      (data:string)=>{msg.channel.send({embed : {
        'color' : '#00bfff',
        'title':'Fetched document : ',
        'description' : '```html\n'+data.substr(0,500)+'```',
        'fields' : [
          {
            'name' : 'Full document :',
            'value': `https://cors-fetch-it.herokuapp.com/${args[0]}`
          },
        ],
        'timestamp':new Date(),
        'footer': conf.info,
        }})},
        (err:any)=>{msg.channel.send({embed:{
          'color': '#00bfff',
          'title':'Failed to fetch :',
          'description':`\`${err.message}\``,
          'timestamp':new Date(),
          'footer':conf.info,
        }})}
    );
  }
};

//To  fetch and callback
function fetchit(link:string, func:any, error:(error:any)=>void)  {
  fetch(link)
    .then((resp:any) => resp.text())
    .then((d:string) =>{ if(func)func(d);})
    .catch((err:any) => error(err));
}
