import {
  Message,
  ReactionCollector,
  MessageEmbed,
  MessageReaction,
} from 'discord.js'


// page navigation handler aka Pagination
class pagination {
  declare pages : number;
  declare uid : string;
  declare error : Function;
  declare warn : Function;
  declare handler : embedHandler|stringHandler;
  declare msg : Message;
  public page = 0;
  private btns = [
    '🔢', '⏮️','◀️', '▶️', '⏭️' ,'🗑️'
    // '🔢', '⏪', '⬅️','➡️','⏩','🆗'
  ];
  constructor(
    message:Message,
    arg:string|[{[key:string]:any}]|MessageEmbed[],
    error: Function ,
    warn: Function
  ){
    this.uid = message.author.id;
    this.error = error;
    this.warn = warn;
    
    if(typeof arg === 'string'){
      let stringArr:String[]=[];
      for (let i = 0; i < arg.length; i += 700) 
        stringArr.push(arg.substr(i, 700));
      this.handler = new stringHandler(stringArr);
    } 
    else this.handler = new embedHandler(arg);
    this.pages = this.handler.pages;
    this.main(message)
  };
  
  async main(message:Message){
    this.msg = await message.channel
        .send(this.handler.rander(0));
    let reactionCollector:ReactionCollector = this.msg
      .createReactionCollector((react,user)=>
        this.btns.includes(react.emoji.name)&&
          user.id==message.author.id,
        {idle:120000,max:999}
    );
    
    reactionCollector.on('collect',(react)=>{
      react.users.remove(message.author.id).catch(e=>{});
      let pg=this.page;
      [
        ()=>{
          this.msg.channel
          .send('\👁️ |Enter the page index you wanna jump to!')
          .then(m0=>
            m0.channel.awaitMessages(
              f=>f.content>0&&f.content<=this.pages,
              {max:1,time:18000,errors:['time']}
            ).then(c=>{
              //@ts-expect-error
              this.page=parseInt(c.first().content)-1;
              c.first()?.delete().catch(e=>{});
              m0.delete().catch(e=>{});
              this.rander();
            }).catch(()=>m0.delete().catch(e=>{}))
          );
        },
        ()=>pg=0,
        ()=>--pg,
        ()=>++pg,
        ()=>pg=this.pages-1,
        ()=>this.msg.delete().catch(e=>{}),
      ][this.btns.indexOf(react.emoji.name)]();
      
      pg=(pg>=this.pages)?this.pages-1:(pg<0)?0:pg;
      if(pg!==this.page){
        this.page=pg;
        this.rander();
      }
    });
    
    if(this.pages>1)
      await this.msg.react(this.btns[0]).catch(e=>{});
    if(this.pages>2)
      await this.msg.react(this.btns[1]).catch(e=>{});
    if(this.pages>1)
      await this.msg.react(this.btns[2]).catch(e=>{});
    if(this.pages>1)
      await this.msg.react(this.btns[3]).catch(e=>{});
    if(this.pages>2)
      await this.msg.react(this.btns[4]).catch(e=>{});
    await this.msg.react(this.btns[5]).catch(e=>
      this.error(e));
    
    reactionCollector.on('end',()=>
      this.msg.reactions.removeAll().catch(e=>{})
    );
  };
  
  rander(){
    this.msg.edit(this.handler.rander(this.page)).catch(e=>{});
  };
}

class embedHandler{
  declare pages : number;
  declare embeds : MessageEmbed[];
  constructor(embeds:[{[key:string]:any}]|MessageEmbed[]){
    this.pages = embeds.length;
    embeds.forEach((e,i)=>{
      if(!i)return this.embeds=[new MessageEmbed(e)];
      this.embeds.push(new MessageEmbed(e))
    });
  }
  rander(i:number){
    //console.log(this.embeds);
    this.embeds[i]=this.embeds[i]
      .setFooter(`${i+1}/${this.pages}`);
    return {embed:this.embeds[i]};
  }
}


class stringHandler{
  declare pages : number;
  declare array : String[];
  constructor(array : String[]){
    this.pages = array.length;
    this.array = array;
  }
  rander(i:number){
    return {content:`\` ${i+1}/${this.pages} \``+'```\n'+this.array[i]+'```'};
  }
}

export default function main(
    message : Message, 
    arg: MessageEmbed[]|string,
    error:Function = ()=>{},
    warning:Function = ()=>{}
  ){
  if(arg.length==0){return error({
    code : 'EMPTY',
    message:'Can\'t send Empty Messages'
  })}
  return new pagination(message,arg,error,warning);
}

//type MessageEmbed ={[key:string]:any};