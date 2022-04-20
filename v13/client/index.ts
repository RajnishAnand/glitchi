import { ApplicationCommandDataResolvable, Client, Collection, Intents} from 'discord.js';
import {Command, Event, RegisterSlashCommandsOption} from '../Interfaces';
import Config from "./config";
import {readdirSync} from 'fs';
import path from 'path';
import {SlashCommand} from '../Interfaces/';

export default class ExtendClient extends Client {
  public commands:Collection<string,Command> = new Collection();
  public slashCommands:Collection<string,SlashCommand>=new Collection();
  public events:Collection<string, Event> = new Collection();
  public aliases:Collection<string,Command> = new Collection();
  public config = Config;
  
  constructor(){
    super({
      intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      ],
      sweepers:{
        messages: {
          interval: 600000,
          lifetime: 600000
        }
      }
    })
  }

  public async init(){
    console.log("logging in...\n");
    this.login(process.env.TOKEN);

    //commands 
    const commandsPath = path.join(__dirname,'..','commands')
    const commandFolders=readdirSync(commandsPath);
    
    commandFolders.forEach((folder)=>{
      const commandFiles = readdirSync(`${commandsPath}/${folder}`).filter((file)=>file.endsWith('.js'));
      
      commandFiles.forEach((file)=>{
        const command : Command = require(`${commandsPath}/${folder}/${file}`).command;
        command.category = folder;
        this.commands.set(command.name, command);
        
        if(command?.aliases?.length){
          command.aliases.forEach((alias:string)=>{
            this.aliases.set(alias, command)
          });
        }
      });
    });
    
    //Slash Commands
    const commandSlash : ApplicationCommandDataResolvable[]=[];
    const slashCommandsPath = path.join(__dirname,'..','commands-slash');
    const slashCommandFiles = readdirSync(slashCommandsPath).filter(f=>f.endsWith('.js'));
                                                             
    slashCommandFiles.forEach(async filePath => {
      const slashCommand : SlashCommand = require(`${slashCommandsPath}/${filePath}`).command;
      this.slashCommands.set(slashCommand.name,slashCommand);
      commandSlash.push(slashCommand);
    })

    //Events
    const eventsPath= path.join(__dirname,'..','events');
    const eventFiles = readdirSync(eventsPath).filter(f=>f.endsWith('.js'));

    eventFiles.forEach((file)=>{
      const event : Event =require(`${eventsPath}/${file}`).event;
      this.events.set(event.name,event);
      
      if(event.once)this.once(event.name,event.execute.bind(null,this)); 
      else this.on(event.name,event.execute.bind(null,this));
    });
    
    
  }

  async registerSlashCommand ({guildId,commands}:RegisterSlashCommandsOption){
      if(guildId){
        return await this.guilds.cache.get(guildId)?.commands
          .set(commands)
          .then(()=>{
            console.log(`Registering Commands to ${guildId}`);
            return true
          })
          .catch(()=>false)
      }
      else {
        this.application?.commands.set(commands);
        console.log(`Registering global Commands.`)
        return true;
      }
  }
}
