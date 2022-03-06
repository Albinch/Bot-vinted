import * as Discord from "discord.js";
import * as fs from "fs";
import { watch } from "./vinted-bot";
import Item from "./item";

export const client = new Discord.Client({ intents : [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const bot = JSON.parse(fs.readFileSync("./discord.json", "utf-8")).bot;

client.on("ready", () => {
    console.log("Connecté !");
});

client.on("messageCreate", async function(message){
    let prefix = "!";
    if(message.channel.type !== "DM"){
        if(message.content === prefix + "start"){
            await watch(message.channel);
        }
    }
});

client.on("newItemsEvent", async function sendAlert(item: Item, channel: Discord.AnyChannel){
    (channel as Discord.TextChannel).send("Hey @everyone, j'ai trouvé un nouvel article !<:star_struck:949371085181296711>\n"
                                        + "- Prix : " + item.price + " " + item.currency + "\n"
                                        + "- Taille : " + item.size + "\n"
                                        + "Cours le cliquer ! <:arrow_right:949371810296778843>\n" + item.url + String(item.id));
});

client.login(bot.bot_token);