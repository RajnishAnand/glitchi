import {
  CommandInteraction,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
  Snowflake
} from 'discord.js';
/////////////////////////////////////////////////////

interface paginationOption<T extends 'S'|'E'>{
  page ?:number;
  initialPage ?: number ;
  
  // string options
  code ?: T extends 'S' ? string : never;
  title ?: T extends 'S' ? string : never;
  chunkSize ?: T extends 'S' ? number : never;
  timestamp ?: T extends 'S' ? number : never;
}


// MAIN exported Class
export default class pagination <T extends string | MessageEmbed[]>{
  declare msg : Message ;
  declare author : Snowflake;
  declare handler : stringHandler|embedHandler;
  public buttons = ['🔢', '⏮️','◀️', '▶️', '⏭️' ,'🗑️'];
  constructor (
    message: Message|CommandInteraction,
    argument: T,
    options ?: T extends string 
    ? paginationOption<'S'>
    : T extends MessageEmbed[]
      ? paginationOption<'E'>
      : never
  ) {
    
    if(typeof argument =='string'){
      this.handler = new stringHandler(
        argument,
        options?.chunkSize,
        options?.title,
        options?.code,
        options?.timestamp,
        options?.page
      );
    }
    else if(Array.isArray(argument)){
      this.handler = new embedHandler(
        argument,
        // option?.page
        //TODO : Add page option in embed
      )
    }
    
    if (message instanceof Message){
      message.channel.send(this.handler.value)
      .then((m0)=>{
        this.msg=m0;
        this.main();  
      });
      this.author = message.author.id;
    }
    
    //TODO : check of this works
    //TODO : Add options for differ reply
    
    else if(message instanceof CommandInteraction ){
      if(typeof this.handler.value =='string')
        message.reply({
          content:this.handler.value,
          fetchReply:true
        }).then((m0)=>{
          if(! (m0 instanceof Message))
            return new Error('Invalid instance if message');
          this.msg=m0;
          this.main();
        });
      else if(Array.isArray(argument))
        message.reply({
          embeds:this.handler.value.embeds,
          fetchReply:true
        }).then((m0)=>{
          if(! (m0 instanceof Message))
            return new Error('Invalid instance if message');
          this.msg=m0;
          this.main();
        });
      this.author = message.user.id;
    };
    
  }
  private async main(){
    if(this.handler.length>2)await this.msg.react(this.buttons[0]);
    if(this.handler.length>2)await this.msg.react(this.buttons[1]);
    if(this.handler.length>1)await this.msg.react(this.buttons[2]);
    if(this.handler.length>1)await this.msg.react(this.buttons[3]);
    if(this.handler.length>2)await this.msg.react(this.buttons[4]);
    this.msg.react(this.buttons[5]);
    
    const reactionCollector=await this.msg.createReactionCollector({
      filter : (react, user)=>user.id==this.author&&this.buttons.includes(decodeURI(react.emoji.identifier)),
      idle:120000,
    });
    
    reactionCollector.on('end',()=>{
      this.msg.reactions.removeAll().catch(()=>null);
    })
    
    reactionCollector.on('collect',async (react)=>{
      react.users.remove(this.author).catch(()=>null);
      let pg = this.handler.page;
      const func = [
        ()=>{this.goToPage()},
        ()=>{pg = 1},
        ()=>{pg -= +(pg>1)},
        ()=>{pg += +(pg<this.handler.length);},
        ()=>{pg = this.handler.length},
        ()=>{this.msg.delete().catch(()=>null)}
        // .catch() : in case its already deleted
      ][this.buttons.indexOf(decodeURI(react.emoji.identifier))]();
      if(!(pg==this.handler.page)){
        this.handler.page=pg;
        this.render();
      };
    })
  }
  
  async goToPage(){
    this.msg.channel.send("\\⚡ Page! You wanna jump to ?")
      .then(m0=>{
        return m0.channel.awaitMessages({
          filter:(f:Message)=>f.author.id==this.author,
          max:1
        }).then((c)=>{
          m0.delete().catch(()=>null);
          if( 
            !/^\d+$/.test(c?.first()?.content??'')
            ||parseInt(c?.first()?.content??'')<0
            ||parseInt(c?.first()?.content??'')>this.handler.length
          )return;
          this.handler.page = parseInt(c?.first()?.content??'2');
          c.first()?.delete().catch(()=>null);
          this.render();
        // .catch in case its already deleted
        }).catch(()=>m0.delete().catch(()=>null))
      })
  }
  // .catch in case its already deleted
  render(){this.msg.edit(this.handler.value).catch(()=>null);}
}

class embedHandler {
  public page = 1;
  public length:number;
  private chunks : MessageEmbed[];
  constructor(chunks: MessageEmbed[]){
    this.length = chunks.length;
    this.chunks=chunks.map((e,i)=>{
      const embed=new MessageEmbed(e)
      if(chunks.length>1)
        embed.setFooter(`Page : ${i+1}/${chunks.length}`);
      return embed;
    });
  }

  get value(){ return{embeds:[ this.chunks[this.page-1]]}; }
}


class stringHandler {
  public page = 1;
  public declare length : number;
  private declare chunks:string[];
  private declare timestamp ?: number;
  private declare code :string;
  private declare title : string|undefined;
  constructor(
    str : string,
    chunkSize:number=800,
    title:string|undefined,
    code:string='',
    timestamp?:number,
    page:number = 1,
  ){
    this.length= Math.ceil(str.length/chunkSize);
    this.code = code;
    this.title = title;
    this.timestamp = timestamp?Math.floor(timestamp/1000):undefined;
    this.page = (0<page&&page<=this.length)?page:1;
    
    for (let i = 0; i <= this.length; i++) 
      if(!i)this.chunks=[
        this.decorate(str.substr(i*chunkSize,chunkSize),i)]
      else this.chunks.push(
        this.decorate(str.substr(i*chunkSize,chunkSize),i));
  }
    
  private decorate(str:string,page:number){
    return "```"+this.code+"\n"
      +(str==''?'empty':str)+'```'
      +(this.length>1?(`\` ⛬ Page : ${page+1}/${this.length} \` `):'')
      +(this.title?`\`‣ ${this.title} \` `:'')
      +(this.timestamp?` <t:${this.timestamp}:R>  `:'');
  }
  
  get value(){ return this.chunks[this.page-1]; }
} 
