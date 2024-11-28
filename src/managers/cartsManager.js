import fs from 'fs';

const PATH = './src/files/carts.json';

export default class CartsManager {
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


    async getCarts(){
        const data = await fs.promises.readFile(PATH,'utf-8');
        const carts = JSON.parse(data);
        return carts;
    }

    async getCartById(cartId){
        const data = await fs.promises.readFile(PATH,'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find(s => s.id === cartId);
        return cart

    }

    async addCart(newCart){
        const data = await fs.promises.readFile(PATH,'utf-8');
        const carts = JSON.parse(data);
        console.log(carts)
        console.log(carts.lenght);
        if(carts.lenght===0 || carts.lenght === undefined){
            newCart.id=1
        }else{
            newCart.id = carts[carts.lenght-1].id+1;
        }
        newCart.product = []
        carts.push(newCart);
        await fs.writeFileSync(PATH,JSON.stringify(carts));

        return(newCart);
    }

    async addProductsToCart(cartId,productId){

        const data = await fs.promises.readFile(PATH,'utf-8');
        const carts = JSON.parse(data);
        let cart = carts.find(s => s.id === cartId);
        const a = carts.indexOf(cart)
        
        const product = {
            product : productId,
            quantity : 1
        }
        cart.product.push(product)
        carts.splice(a,1,cart);
        await fs.writeFileSync(PATH,JSON.stringify(carts));
        return(cart);
    }



}