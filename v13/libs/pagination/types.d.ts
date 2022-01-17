import {MessageEmbed} from "discord.js";

export type PaginationArgument = string|MessageEmbed[]|{
  [key: string]: string |MessageEmbed[]
}

export interface PaginationOption<T>{
  //stringPaginationOptions
  code ?: T extends string ? string : never;
  chunkSize ?: T extends string ? number : never;
  title ?: T extends string ? string : never;
  timestamp ?: T extends string ? Date : never;

  //EmbedPaginationOption : no options

}
