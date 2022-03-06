export default class Item{
   id: number;
   price: number;
   currency: string;
   brand: string;
   url: string;
   size: string;
   timestamp: number;

   constructor(id: number, price: number, currency: string, brand: string, url: string, size: string, timestamp: number){
       this.id = id;
       this.price = price;
       this.currency = currency;
       this.brand = brand;
       this.url = url;
       this.size = size;
       this.timestamp = timestamp
   }

   printItem(){
       console.log("Id : " + this.id);
       console.log("Price : " + this.price + " " + this.currency);
       console.log("Devise : " + this.currency);
       console.log("Marque : " + this.brand);
       console.log("Url : " + this.url);
       console.log("Taille : " + this.size);
       console.log("Timestamp : " + this.timestamp);
   }

   isInsideList(items: Array<Item>){
       let trouve = false;
       let i = 0;
       if(items.length != 0){
        while(!trouve && i < items.length){
            if(this.equals(items[i])){
                trouve = true;
            }else{
                i++;
            }
        }
       }

       return trouve;
   }

   equals(item: Item){
       return(this.id === item.id && this.price === item.price && this.currency === item.currency && this.brand === item.brand && this.url === item.url && this.size === item.size)
   }
}