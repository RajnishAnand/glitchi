import { ClientEvents } from 'discord.js';
import Client from '..';

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (client: Client, ...args: any[]) => any;
}
