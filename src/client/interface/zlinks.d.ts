import { string } from "mathjs";
import { TextCommandOptions } from "./textCommad";

export interface Zlink{
  name: string,
  description: string,
  argumentType: zType,
  returnType: zType,
  run: (parms: TextCommandOptions) => any,
} 


// TODO: extend textCommandOPtions to include zlink command and paramenters


export type zType =  "user" | "text" | "image" | null;
