import { ButtonInteraction, MessageOptions } from "discord.js";
import { ExtendMessage } from "Interfaces";
import StringHandler, {StringHandlerOptions} from "./handlers/string";

export class stringPagination{
  declare handler: StringHandler;
  declare refMsg: ExtendMessage;
  declare msg: ExtendMessage;
  declare filter: (i:ButtonInteraction)=>boolean;

  constructor(refMsg: ExtendMessage,text:string,options?:StringPaginationOption){
    // data
    this.refMsg = refMsg;
    this.filter = options?.filter || ((interaction)=>
      interaction.user.id == this.refMsg.author.id);
    if(options?.initialPage)this.page = options.initialPage;
    
    this.handler = new StringHandler(text,{
      split: options?.split, 
      decoration: options?.decoration
    })

    this.init();
  }
  
  get value(){ return { 
    content: this.handler.value,
    components: this.components
  }}
  
  get page(){return this.handler.page};
  set page(x:number){
    this.handler.page=(x>0&&x<this.length+1)?x:this.page;
  };
  get length(){return this.handler.length}


  // initialisation
  async init (){
    this.msg = await this.refMsg.channel
      .send(this.value) as ExtendMessage;

    const collector=this.msg.createMessageComponentCollector({
      idle: 120000,
      componentType: "BUTTON",
      dispose: true,
      filter: this.filter
    })
    
    // movement
    collector.on("collect",async (interaction)=>{
      let i = this.page;
      switch (interaction.customId){
        case "left": i--; break;
        case "right": i++; break;
        case "page":this.goto(interaction); break;
        case "delete": this.msg.delete(); break;
      }
      this.page = i;
      interaction.update(this.value)
        .catch(()=>{})
    })
    
    // remove components when idle
    collector.on("end", ()=>{
      this.msg.edit({components:[]}).catch(()=>{})
    })
  }
  
  // jump to page
  async goto(interaction:ButtonInteraction){
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
    return [{
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
    }]
  }



}

type StringPaginationOption = {
  filter ?:()=>boolean;
  initialPage ?: number;
} & StringHandlerOptions;

