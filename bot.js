import * as vinted from "vinted-api";

function search_posts(){
    let parameters = "";
    let baseUrl = "https://www.vinted.fr/vetements?";

    for (let brand in brands){
        parameters += "brand_id[]=" + brands[brand] + "&";
    }

    console.log(baseUrl + parameters.slice(0, -1));

    vinted.search(baseUrl + parameters.slice(0, -1)).then((posts) => {
        console.log(posts);
    });
}

const brands = {
    "Gucci" : 567,
    "Balenciaga" : 2369
};

search_posts();