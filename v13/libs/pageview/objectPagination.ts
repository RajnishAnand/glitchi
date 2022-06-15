import { MessageComponentInteraction, MessageEmbed, MessageOptions, SelectMenuInteraction} from "discord.js";
import { ExtendMessage } from "Interfaces";
import EmbedHandler from "./handlers/embed";
import StringHandler, { StringHandlerOptions } from "./handlers/string";

export class objectPagination {
  declare handlers: (StringHandler | EmbedHandler)[];
  declare details: detailsOptions[];
  declare refMsg: ExtendMessage;
  declare msg: ExtendMessage;
  declare filter: (i:MessageComponentInteraction)=>boolean;

  handlerIndex = 0; 

  constructor(refMsg: ExtendMessage,data:ObjectPaginationData,options?:ObjectPaginationOption){

    // data 
    this.handlers = [];
    this.details = [];
    data.forEach((e)=>{
      if("text" in e) this.handlers
        .push(new StringHandler(e.text,e.options)); 
      else this.handlers.push(new EmbedHandler(e.embeds));
      this.details.push({
        title:e.title,
        description: e.description,
        emoji: e.emoji
      });
    })


    this.refMsg = refMsg;
    this.filter = options?.filter || ((interaction)=>
      interaction.user.id == this.refMsg.author.id);

    this.init();
  }  
  
  get handler(){return this.handlers[this.handlerIndex]}
  get value(){  
    if (this.handler instanceof EmbedHandler)return {
      content: null,
      embeds: this.handler.value,
      components: this.components
    }
    else return {
      embeds: [],
      content: this.handler.value,
      components: this.components
    }
  }
  
  get page(){return this.handler.page};
  set page(x:number){
    this.handler.page=(x>0&&x<this.length+1)?x:this.page;
  };
  get length(){return this.handler.length}


  // initialisation
  async init (){
    this.msg = await this.refMsg.channel
      .send(this.value) as ExtendMessage;

    // button interaction collector
    const collector=this.msg.createMessageComponentCollector({
      idle: 120000,
      dispose: true,
    })
    
    // movement
    collector.on("collect",async (interaction)=>{
      if(!this.filter(interaction)){
        return interaction.reply({
          ephemeral: true,
          content: [
            "Don't click! <:youBad:888716976145461249>.",
            "Don't click! <:youBad:888716976145461249>, I'll ban you!",
            "Eat this chocolate Instead! 🍫",
            "No, I'm responding to you!,👻"
          ][Math.floor(Math.random()*4)]
        })
      };

      switch (interaction.customId){
        case "left": this.page--; break;
        case "right": this.page++; break;
        case "page": this.goto(interaction); break;
        case "delete": this.msg.delete(); break;
        case "select": this.handlerIndex = +(interaction as SelectMenuInteraction).values[0]; break;
      }
      interaction.update(this.value)
        .catch(()=>{})
    })
    
    // remove components when idle
    collector.on("end", ()=>{
      this.msg.edit({components:[]}).catch(()=>{})
    })

  }

  // jump to page
  async goto(interaction:MessageComponentInteraction){
    await interaction.showModal({
      title: "Jump to Page [40seconds]", 
      customId: "goto",
      components: [{
        type: "ACTION_ROW",
        components: [{
          type: "TEXT_INPUT",
          label: `Page you wanna jump to: [1-${this.length}]`,
          customId: "topage",
          style: "SHORT",
          required: true,
          minLength: 1,
          maxLength: this.length.toString().length,
          placeholder: "Index of Page. eg,(1)"
        }]
      }]
    })
    interaction.awaitModalSubmit({
      filter: (x) =>
        +x.fields.getTextInputValue("topage")>0 &&
        +x.fields.getTextInputValue("topage")<this.length+1
      ,
      time: 40000
    })
    .then(interaction=>{
      this.page=+interaction.fields.getTextInputValue("topage")
      interaction.update(this.value)
    })
    .catch(()=>{})
  }

  get components():MessageOptions["components"]{
    return [
      {
        type: "ACTION_ROW",
        components: [
          {
            type: "BUTTON",
            style: "SECONDARY",
            emoji: this.refMsg.client.config.emojis.leftArrow,
            customId: "left",
            disabled: this.page==1||this.length==1
          },
          {
            type: "BUTTON",
            label : `${this.page}/${this.length}`,
            style: "PRIMARY",
            customId : "page",
            emoji: "📑",
            disabled: this.length <3
          },
          {
            type: "BUTTON",
            style: "SECONDARY",
            emoji: this.refMsg.client.config.emojis.rightArrow,
            customId: "right",
            disabled: this.length ==1||this.page==this.length
          },
          {
            type: "BUTTON",
            style: "SECONDARY",
            emoji: this.refMsg.client.config.emojis.cross,
            customId: "delete"
          }
        ]
      },
      {
        type: "ACTION_ROW",
        components: [{
          type: "SELECT_MENU",
          customId: "select",
          
          options: this.details.map((t,i)=>({
            label: t.title,
            value: i.toString(),
            description: t.description, 
            emoji: t.emoji, 
            default: i==this.handlerIndex
          }))
        }]
      }
    ]
  }
  
}


type ObjectPaginationData =(
  ({
    text: string;
    options ?: StringHandlerOptions;
  }|{
    embeds: MessageEmbed[];
  }) & detailsOptions
)[];


type detailsOptions = {
  title: string;
  description?: string;
  emoji?: string;
}

interface ObjectPaginationOption {
  filter:()=>boolean;
}


