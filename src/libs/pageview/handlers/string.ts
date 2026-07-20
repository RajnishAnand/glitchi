import { PageProvider, PagePayload } from './provider';

export default class StringHandler implements PageProvider {
  public page = 1;
  public length = 1;
  private chunks: string[] = [' '];

  constructor(text: string, options?: StringHandlerOptions) {
    this.update(text, options);
  }

  public update(text: string, options?: StringHandlerOptions) {
    const chunks = this.intoChunks(text, options?.split);
    this.length = chunks.length;
    this.chunks = this.decorate(chunks, options?.decoration);
    this.page = Math.min(this.page, this.length) || 1; // fix: clamp after resize
  }

  render(): PagePayload {
    return { content: this.chunks[this.page - 1] };
  }

  // Decoration : codeblock,title,timestamp .....
  private decorate(texts: string[], options?: DecorationOption) {
    return texts.map((str) => {
      let s = str + '\n';
      if (options?.codeblock != false)
        s = '```' + (options?.lang || '') + '\n' + str.replaceAll('`', '\\`') + ' ```';
      if (this.length > 1) s += `\` ⠪ Page : ${texts.indexOf(str) + 1}/${this.length} \` `;
      if (options?.title) s += `\`‣ ${options.title} \` `;
      if (options?.secondaryTitle) s += `\`‣ ${options.secondaryTitle} \` `;
      if (options?.timestamp) s += ` <t:${Math.floor(+options.timestamp / 1000)}:R>  `;
      return s;
    });
  }

  // long string into chunks
  private intoChunks(text: string, split: SplitOption = {}) {
    split.min ??= 800;
    split.max ??= 850;
    split.with ??= ' ';

    let lastSplitIndex = 0;
    let lastSplitLength = split.min;
    const chunks = [];

    o: for (let i = 0; lastSplitIndex < text.length; i += lastSplitLength) {
      for (let j = split.min; j < split.max; j++) {
        if (text[lastSplitIndex + j - 1] == split.with) {
          chunks.push(text.substring(lastSplitIndex, lastSplitIndex + j));
          lastSplitLength = j;
          lastSplitIndex += j;
          continue o;
        }
      }
      chunks.push(text.substring(lastSplitIndex, lastSplitIndex + split.min + 1));
      lastSplitIndex += split.min + 1;
      lastSplitLength = split.min;
    }

    return chunks;
  }
}

export interface StringHandlerOptions {
  split?: SplitOption;
  decoration?: DecorationOption;
}

interface SplitOption {
  min?: number;
  max?: number;
  with?: string;
}

type DecorationOption = {
  title?: string;
  secondaryTitle?: string;
  timestamp?: Date;
} & ({ lang?: string; codeblock?: true } | { codeblock: false });
