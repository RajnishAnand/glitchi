import { MessageEmbed } from 'discord.js';
import { embedHandler } from './embedHandler';
import { stringHandler } from './stringHandler';

export class objectHandler {
  public declare keys: string[];
  private declare handlers: (stringHandler | embedHandler)[];

  constructor(obj: { [index: string]: string | MessageEmbed[] | undefined }) {
    this.keys = Object.keys(obj).filter((k) => obj[k] !== undefined);
    Object.values(obj).forEach((o, i) => {
      if (typeof o == 'undefined') return;
      if (typeof o == 'string') {
        if (!this.handlers?.length)
          this.handlers = [
            new stringHandler(o, undefined, this.keys[i], undefined, 'js'),
          ];
        else
          this.handlers.push(
            new stringHandler(o, undefined, this.keys[i], undefined, 'js'),
          );
      } else {
        if (!this.handlers?.length) this.handlers = [new embedHandler(o)];
        else this.handlers.push(new embedHandler(o));
      }
    });
  }
  value(n: number) {
    return this.handlers[n];
  }
}
