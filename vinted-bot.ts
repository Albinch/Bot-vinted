import * as vinted from "vinted-api";
import * as fs from "fs";
import Item from "./item";

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

    const posts = await vinted.search(baseUrl + brandParameters.slice(0, -1) + sizeParameters.slice(0, -1) + "&order=newest_first");

    posts.items.forEach((element: any) => {
        let currentItem = new Item(element.id, Number(element.price), element.currency, element.brand_title, element.url, element.size_title);
        if(!currentItem.isInsideList(items)){
            items.push(currentItem);
        }
    });
}

async function watch(items: Array<Item>){
    let nbItems = items.length;
    console.log("initialisation : " + nbItems);
    while(true){
        await delay(1000);
        storeItems(items);
        if(items.length != nbItems){
            nbItems = items.length;
            console.log("nbItems incrémenté : " + nbItems);
        }
    }
}

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main(){
    let items: Array<Item> = [];
    await watch(items);
}

main()