import {
  Message,
  ReactionCollector,
  
  MessageEmbed,
  MessageEmbedAuthor,
  EmbedField,
  MessageAttachment,
  FileOptions,
  MessageEmbedImage,
  MessageEmbedProvider,
  MessageEmbedThumbnail,
  
  MessageReaction,
  User
} from 'discord.js';


// page navigation handler aka Pagination
class pagination {
  declare pages : number;
  declare uid : string;
  declare error: (err:customError)=>null;
  declare warn : (err:customError)=>null;
  declare handler : embedHandler|stringHandler;
  declare msg : Message;
  public page = 0;
  private btns = [
    '🔢', '⏮️','◀️', '▶️', '⏭️' ,'🗑️'
    // '🔢', '⏪', '⬅️','➡️','⏩','🆗'
  ];
  
  private readonly reactionFilter = (
    react:MessageReaction,
    user:User,
    message:Message
  ) => this.btns.includes(react.emoji.name) &&
      user.id===message.author.id;
  
  private readonly gotoPageFilter = (f:Message) => 
    parseInt(f.content) > 0 &&
    parseInt(f.content) <= this.pages;

  constructor(
    message:Message,
    arg: string|EmbedObject[]|MessageEmbed[],
    error: (err:customError)=>null,
    warn : (err:customError)=>null,
    code : string=' ',
  ){
    this.uid = message.author.id;
    this.error = error;
    this.warn = warn;
    
    if(typeof arg === 'string'){
      const stringArr:string[]=[];
      for (let i = 0; i < arg.length; i += 700) 
        stringArr.push(arg.substr(i, 700));
      this.handler = new stringHandler(stringArr,code);
    } 
    else this.handler = new embedHandler(arg);
    this.pages = this.handler.pages;
    this.main(message)
  }
  
  async main(message:Message){
    this.msg = await message.channel
      .send(this.handler.render(0));

    const reactionCollector:ReactionCollector = this.msg.createReactionCollector((react,user)=>this.reactionFilter(react,user,message),{idle:120000,max:999});
    
    reactionCollector.on('collect',(react)=>{
      react.users.remove(message.author.id).catch(()=>null);
      let pg=this.page;
      [ 
        ()=>{ //Goto page
          this.msg.channel.send('👁️ |Enter the page index you wanna jump to!')
            .then(m0=>{
              return m0.channel.awaitMessages(
                this.gotoPageFilter,
                {max:1,time:18000,errors:['time']}
              ).then((c)=>{
                if(isNaN(parseInt(c.first()?.content as string)))return;
                this.page = parseInt(c.first()?.content as string)-1;
                c.first()?.delete().catch(()=>null);
                m0.delete().catch(()=>null);
                this.render();
              }).catch(()=>m0.delete().catch(()=>null))
            })
        },
        ()=>pg=0, // First page
        ()=>--pg, // Previous page
        ()=>++pg, // Next page
        ()=>pg=this.pages-1, // Last page
        ()=>this.msg.delete().catch(()=>null),  // page delete
      ][this.btns.indexOf(react.emoji.name)]();
      
      pg=(pg>=this.pages)?this.pages-1:(pg<0)?0:pg;
      if(pg!==this.page){
        this.page=pg;
        this.render();
      }
    });
    
    if(this.pages>1)
      await this.msg.react(this.btns[0]).catch(()=>null);
    if(this.pages>2)
      await this.msg.react(this.btns[1]).catch(()=>null);
    if(this.pages>1)
      await this.msg.react(this.btns[2]).catch(()=>null);
    if(this.pages>1)
      await this.msg.react(this.btns[3]).catch(()=>null);
    if(this.pages>2)
      await this.msg.react(this.btns[4]).catch(()=>null);
    await this.msg.react(this.btns[5]).catch(e=>
      this.error({code:e.code,message:e.message}));
    
    reactionCollector.on('end',()=>
      this.msg.reactions.removeAll().catch(()=>null)
    );
  }
  
  render(){
    this.msg.edit(this.handler.render(this.page))
      .catch(()=>null);//failsafe
  }
}

class embedHandler{
  pages : number;
  embeds : MessageEmbed[];
  constructor(embeds:EmbedObject[]|MessageEmbed[]){
    this.pages = embeds.length;
    this.embeds = []
    embeds.forEach((e,i)=>{
      if(!i)return this.embeds=[new MessageEmbed(e)];
      this.embeds.push(new MessageEmbed(e))
    });
  }
  render(i:number){
    this.embeds[i]=this.embeds[i];
      if(!(this.pages==1))this.embeds[i]
        .setFooter(`${i+1}/${this.pages}`);
    return {embed:this.embeds[i]};
  }
}

class stringHandler{
  declare pages : number;
  declare array : string[];
  declare code : string;
  constructor(array : string[],code:string){
    this.pages = array.length;
    this.array = array;
    this.code = code;
  }
  render(i:number){
    return {content:`\` ${i+1}/${this.pages} \``+'```'+this.code+'\n'+this.array[i]+'```'};
  }
}

//Main Exported Function
export default function main (
  message : Message, 
  arg: EmbedObject[]|MessageEmbed[]|{text:string,code:string}|string,
  error:(err:customError)=>null = ()=>null,
  warning:(err:customError)=>null = ()=>null,
  ){
  if(Object.values(arg).length===0){return error({
    code : 'EMPTY',
    message:'Can\'t send Empty Messages',
  })}
  if(typeof arg=='object' && !Array.isArray(arg))
    return new pagination(
      message,arg.text,error,warning,arg.code);
  return new pagination(message,arg,error,warning);
}

//Interfaces and Types
export interface EmbedObject{
  author? : MessageEmbedAuthor;
  color? : number|string;
  description? : string;
  fields? : EmbedField[];
  files? : [string|MessageAttachment|FileOptions];
  //footer :reserved for page Number
  image? : MessageEmbedImage;
  provider? : MessageEmbedProvider;
  thumbnail? : MessageEmbedThumbnail;
  timestamp? : number;
  title? : string;
  type? : 'rich'|'image'|'video'|'gifv'|'article'|'link';
  url? : string;
}

interface customError {
  code:number|string;
  message : string;
}

