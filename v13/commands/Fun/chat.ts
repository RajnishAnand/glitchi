import fetch from 'node-fetch';
import {Message, MessageCollector} from 'discord.js';
import {Command, CommandArgument} from 'Interfaces';

export const command : Command= {
  name: 'chat',
  description: 'Chat with another bot',
  aliases : ['ch'],
  args: true,
  usage : '<start||...text>',
  run(x){new chat(x)}
}

class chat{
  declare msg:CommandArgument["msg"];
  constructor ({msg,args,content}:CommandArgument){
    this.msg = msg;
    this.main(args,content())
  }
  async main(args:string[],content: string){
    if(args[0]=='start'){
      if(this.msg.channel.id in this.msg.client.config.block){
        this.msg.reply('An instance of API interaction is already running! please wait for it to stop!');
        return;
      }
      const collector = 
        this.msg.channel.createMessageCollector({
        filter:(m)=>m.author.id==this.msg.author.id,
        idle:120000
      });

      collector.on('collect',(m)=>this.chat(m,collector));

      collector.on('end',()=>{
        delete this.msg.client.config.block[this.msg.channel.id];
        this.msg.channel.send('Chat API interaction started by '+this.msg.author.tag+' ended!');
      })

      this.msg.client.config.block[this.msg.channel.id]=this.msg.author.id;
      this.msg.channel.send('Chat API interaction started use `--stop` to stop or will automatically stop on inactivity! During this period you won\'t be able to use other commands.');
    }
    else if(this.msg.author.id==this.msg.client.config.ownerId&&args[0]=='train'){
      const collector=this.msg.channel.createMessageCollector({
        filter:(m)=>m.author.id==this.msg.client.config.ownerId,
        max:2
      });
      let arr :string[] = new Array;
      collector.on('collect',(m:Message)=>{
        [
          ()=>{
            arr.push(m.content);
            this.pipe(m.content).then((s)=>{
              m.channel.send('Default : '+s);
            })
          } ,
          ()=>{
            if(m.content.toLowerCase()!=='--cancel'&&m.content.toLowerCase()!=='-c'){
              arr.push(m.content);
              this.train(arr[0],arr[1]).then(s=>{
                m.channel.send(s);
              })
            }else m.channel.send('canceled!');
          }
        ][arr.length]();
      });
      this.msg.channel.send('training started!');
    }
    else {
      this.pipe(content).then((d:string)=>
        this.msg.channel.send(d))
    }
  }
  
  chat(m:Message,collector:MessageCollector){
    if(m.content.toLowerCase()!=='--stop'&&m.content.toLowerCase()!=='-s')
      this.pipe(m.content).then((txt)=>{
        m.channel.send(txt).catch(()=>null);
      });
    else collector.stop();
  }
  
  async pipe(txt:string){
    txt= encodeURIComponent(txt.replace(/\\/g,''));
    try{
    const url = `http://api.brainshop.ai/get?bid=158846&key=${process.env.ACOKEY}&uid=${this.msg.author.id}&msg=${txt}`;
    
    const data = await fetch(url).then(r=>r.json()||r.text());
    return data.cnt.replace(/"/g, '" ')||data;
    
    }catch(err){return 'Opps! API returned an error. Try out few minutes later.'};
  }
  
  async train(inp:string,out:string){
    try{
      const url =  `http://api.brainshop.ai/set?bid=158846&key=${process.env.ACOKEY}&uid=${this.msg.author.id}&in=${inp}&out=${out}`;
      
      const data = await fetch(url).then(r=>r.text())
      return data;
    }
    catch(err){return 'opps! caught an unknown error.'}
  }
}

