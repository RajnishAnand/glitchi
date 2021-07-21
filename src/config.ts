export type conf = {
  prefix: string;
  readonly ownerId: string;
  readonly channels: {[key: string]: string };
  readonly emojis: {[key: string]: string };
  readonly info: {[key: string]: string };
}

const config: conf = {
  prefix: "g.",

  ownerId: "800445583046213663",
  
  channels : {
    errorLog: "857648123676459058",
    feedback: "856907506612830241"
  },

  emojis: {
    thumbsup: "862862241136115732",
    thumbsdown: "862862298556399656"
  },

  info: {
    name: "Glitchi",
    icon_url: "https://cdn.discordapp.com/avatars/852227150455373906/2f06054bcc4e7cea81c975f97849eb91.png"
  },
};

export default config;