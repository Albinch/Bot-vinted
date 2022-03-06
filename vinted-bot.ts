import * as vinted from "vinted-api";
import * as Discord from "discord.js";
import * as fs from "fs";
import Item from "./item";
import { client } from "./discord-bot";

async function storeItems(lastItem: Item){
    const brands = JSON.parse(fs.readFileSync("./brands.json", "utf-8")).brands;
    const sizes = JSON.parse(fs.readFileSync("./brands.json", "utf-8")).sizes;
    let brandParameters = "";
    let sizeParameters = "";
    let baseUrl = "https://www.vinted.fr/vetements?";

    brands.forEach((element: any) => {
        brandParameters += "brand_id[]=" + element.id + "&";
    });

    
    sizes.forEach((element: any) => {
        sizeParameters += "size_id[]=" + element.id + "&";
    });

    try{
        const posts = await vinted.search(baseUrl + brandParameters + sizeParameters.slice(0, -1) + "&order=newest_first", true);
        let lastItemTS: number = lastItem.timestamp;

        const items = posts.items
        .sort((a, b) => 
            new Date(b.photo.high_resolution.timestamp).getTime() - new Date(a.photo.high_resolution.timestamp).getTime()
        ).filter((item) =>
            new Date(item.photo.high_resolution.timestamp).getTime() > lastItemTS
        );

        lastItemTS = new Date(items[0].photo.high_resolution.timestamp).getTime();

        if(lastItemTS != lastItem.timestamp){
            console.log(items[0].title);

            lastItem = new Item(items[0].id, 
                items[0].price, 
                items[0].currency, 
                items[0].brand, 
                items[0].url, 
                items[0].size, 
                new Date(items[0].photo.high_resolution.timestamp).getTime());

                return lastItem;
        }
    }catch(e){
        if(e instanceof TypeError){
            console.log("Aucun nouvel élément n'a été trouvé...")
        }else{
            console.log(e);
        }
    }
}

export async function watch(channel: Discord.AnyChannel){
    const bot: any = JSON.parse(fs.readFileSync("./discord.json", "utf-8")).bot;

    client.login(bot.bot_token);
    
    let lastItem: Item = new Item(0, 0, "", "", "", "", 0);
    while(true){
        await delay(60000);
        storeItems(lastItem).then((item) => {
            if(item){
                lastItem = item;
                client.emit("newItemsEvent", item, channel);
            }
        });
    }
}

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}