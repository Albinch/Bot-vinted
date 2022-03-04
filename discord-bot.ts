import * as Discord from "discord.js";
import * as fs from "fs";

const client = new Discord.Client({ intents : [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const bot = JSON.parse(fs.readFileSync("./discord.json", "utf-8")).bot;

client.on("ready", () => {
    console.log("Connecté !");
});

client.on("messageCreate", async function(message){
    if(message.channel.type !== "DM"){
        if(message.content === "salope"){
            message.reply("loli");
        }
    }
});

client.login(bot.bot_token);