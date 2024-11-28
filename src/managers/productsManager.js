import fs from 'fs';

const PATH = './src/files/products.json';

export default class ProductsManager {
    constructor(){
        if(!fs.existsSync(PATH)){
            this.init();
        }else{
            console.log("Products file found")
        }
    }

    async init(){
        await fs.promises.writeFile(PATH,JSON.stringify([]))
    }

    async getProducts(){
        const data = await fs.promises.readFile(PATH,'utf-8');
        const products = JSON.parse(data);
        return products;
    }

    async getProductsById(productId){
        const data = await fs.promises.readFile(PATH,'utf-8');
        const products = JSON.parse(data);
        const product = products.find(s => s.id === productId);
        return product
    }

    async addProduct(product){
        
        const data = await fs.promises.readFile(PATH,'utf-8');
        const products = JSON.parse(data);
        if(products.length===0 || products.length === undefined){
            product.id = 1
        }else{
            product.id = products[products.length-1].id+1
        }
        product.status = true;
        product.thumbnail = "";
        product.code = 0;

        let repeat = false;
        while(repeat === false){

            repeat = true
            products.forEach(element => {
                
                if(element.code === product.code){
                    product.code = Math.random(1 , 100000000)
                    repeat = false
                }
                
            });
        }

        products.push(product);

        await fs.writeFileSync(PATH,JSON.stringify(products));

        return(product);
        
    }

    async modifyProductById(modifyProduct , productId){

        const data = await fs.promises.readFile(PATH,'utf-8');
        const products = JSON.parse(data);
        let product = products.find(s => s.id === productId);
        const a = products.indexOf(product)
        product = modifyProduct;
        product.id = productId;
        products.splice(a,1,product);

        await fs.writeFileSync(PATH,JSON.stringify(products));
        return(product);

    }

    async deleteProductById(productId){
        console.log(productId);
        const data = await fs.promises.readFile(PATH,'utf-8');
        const products = JSON.parse(data);
        let product = products.find(s => s.id == productId);
        const a = products.indexOf(product);
        products.splice(a,1);
        
        await fs.writeFileSync(PATH,JSON.stringify(products));
        return(product);


    }
}