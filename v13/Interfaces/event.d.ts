import { ClientEvents } from "discord.js";
import Client from "../client";

export interface Event {
  name : keyof ClientEvents;
  once? : boolean;
  execute : (client:Client,...args:any[]) => any;
}
