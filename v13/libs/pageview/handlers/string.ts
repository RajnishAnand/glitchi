export default class StringHandler { 
  public page = 1;
  public length:number;
  private chunks : string[];

  constructor(text:string,options?:StringHandlerOptions){
    const chunks = this.intoChunks(text,options?.split); 
    this.length = chunks.length;
    this.chunks = this.decorate(chunks,options?.decoration);
  }

  get value(){ return this.chunks[this.page-1] };

  // Decoration : codeblock,title,timespam .....
  private decorate(texts:string[],options?:DecorationOption){
    return texts.map((str,i)=>(
      "```"+(options?.lang||"")+"\n"
      + str.replaceAll('`','\\`')
      + ' ```'
      + (this.length>1?(`\` ⠪ Page : ${i+1}/${this.length} \` `):'')
      + (options?.title?`\`‣ ${options.title} \` `:'')
      + (options?.secondaryTitle?`\`‣ ${options.secondaryTitle} \` `:'')
      + (options?.timestamp?` <t:${Math.floor(+options.timestamp/1000)}:R>  `:'')) 
    );
  }

  // long string into chunks
  private intoChunks(text:string, split:SplitOption={}){
    split.min??=800;
    split.max??=850;
    split.with??=" ";

    let lastSplitIndex = 0;
    let lastSplitLength = split.min;
    const chunks = [];
  
    o:for(let i=0;lastSplitIndex<text.length;i+=lastSplitLength){
      for(let j = split.min; j < split.max;j++){
        if(text[lastSplitIndex+j-1]==split.with){
          chunks.push(text.substring(
            lastSplitIndex,
            lastSplitIndex+j
          ));
          lastSplitLength=j;
          lastSplitIndex+=j;
          continue o;
        }
      }
      chunks.push(text.substring(
        lastSplitIndex,
        lastSplitIndex+split.min+1
      ))
      lastSplitIndex+=split.min+1;
      lastSplitLength=split.min;
    }
  
    return chunks;
  }
}

export interface StringHandlerOptions {
  split ?: SplitOption;
  decoration ?: DecorationOption;
}

interface SplitOption {
  min?: number,
  max?: number,
  with?: string
}

interface DecorationOption {
  lang?: string,
  title?: string,
  secondaryTitle?: string,
  timestamp?: Date
}
