import { PageProvider, PagePayload } from './provider';

export default class MixedHandler implements PageProvider {
  public page = 1;
  public length: number;
  private chunks: PagePayload[];

  constructor(pages: PagePayload[]) {
    this.length = pages.length;
    this.chunks = pages;
  }

  render(): PagePayload {
    return this.chunks[this.page - 1];
  }
}
