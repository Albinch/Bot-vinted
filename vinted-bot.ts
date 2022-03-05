import * as vinted from "vinted-api";
import * as Discord from "discord.js";
import * as fs from "fs";
import Item from "./item";
import { client } from "./discord-bot";

async function storeItems(items: Array<Item>){
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

        posts.items.forEach((element: any) => {
            let currentItem = new Item(element.id, Number(element.price), element.currency, element.brand_title, element.url, element.size_title);
            if(!currentItem.isInsideList(items)){
                items.push(currentItem);
            }
        });
    }catch(e){
        console.log(e);
    }
}

export async function watch(items: Array<Item>, channel: Discord.AnyChannel){
    const bot: any = JSON.parse(fs.readFileSync("./discord.json", "utf-8")).bot;

    client.login(bot.bot_token);
    
    let nbItems: number = items.length;
    console.log("initialisation : " + nbItems);
    while(true){
        await delay(5000);
        storeItems(items);
        if(items.length != nbItems){
            let itemsPublished: number = items.length - nbItems;
            
            if(itemsPublished < 5){
                for(let i = 0; i < itemsPublished; i++){
                    client.emit("newItemsEvent", items[nbItems + i], channel);
                }
            }

            nbItems = items.length;
            console.log("nbItems incrémenté : " + nbItems); 
        }
    }
}

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

 /*
async function main(){
    let items: Array<Item> = [];
    await watch(items);
}

main()*/