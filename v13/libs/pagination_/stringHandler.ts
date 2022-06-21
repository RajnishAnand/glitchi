export class stringHandler {
  public page = 1;
  public declare length: number;
  private declare chunks: string[];
  private declare timestamp?: number;
  private declare code: string;
  private declare title: string | undefined;
  private declare secondaryTitle: string | undefined;
  constructor(
    str: string,
    chunkSize: number = 800,
    title?: string,
    secondaryTitle?: string,
    code: string = '',
    timestamp?: Date,
  ) {
    this.length = Math.ceil(str.length / chunkSize);
    this.code = code;
    this.title = title;
    this.secondaryTitle = secondaryTitle;
    this.timestamp = timestamp ? Math.floor(+timestamp / 1000) : undefined;

    for (let i = 0; i <= this.length; i++)
      if (!i) this.chunks = [this.decorate(str.substring(0, chunkSize), i)];
      else
        this.chunks.push(
          this.decorate(str.substring(i * chunkSize, (i + 1) * chunkSize), i),
        );
  }

  private decorate(str: string, page: number) {
    return (
      '```' +
      this.code +
      '\n' +
      str.replaceAll('`', '\\`') +
      ' ```' +
      (this.length > 1 ? `\` ⠪ Page : ${page + 1}/${this.length} \` ` : '') +
      (this.title ? `\`‣ ${this.title} \` ` : '') +
      (this.secondaryTitle ? `\`‣ ${this.secondaryTitle} \` ` : '') +
      (this.timestamp ? ` <t:${this.timestamp}:R>  ` : '')
    );
  }

  get value() {
    return this.chunks[this.page - 1];
  }
}
