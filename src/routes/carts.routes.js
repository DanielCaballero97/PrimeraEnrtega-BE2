import { Router } from "express";
import { cartDao } from "../mongo/cart.dao.js"
import { productDao } from "../mongo/product.dao.js";
import { authorization } from "../middleware/authorization.middleware.js";

const cartsRoutes = Router();


cartsRoutes.get('/',authorization("admin"),async (req,res)=>{
    try {
        let cart = await cartDao.getAll()
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }

})

cartsRoutes.get("/:cid",async(req,res)=>{
    try {
        const { cid } = req.params;
        let cart = await cartDao.getById(cid)
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
})

cartsRoutes.post('/createCart',authorization("admin"),async(req,res)=>{
    try {
        const cart = await cartDao.create();
    
        res.status(201).json({ status: "success", cart });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
      }
})

cartsRoutes.put("/:cid",async(req,res)=>{
    try {
        const { cid } = req.params
        const body = req.body
        const cart = await cartDao.getById(cid)
        body.forEach(e => {

            cart.products.push({product: e.id , quantity: e.quantity})

        });
        await cartDao.update(cid,cart)
        res.status(200).json({cart});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
})

cartsRoutes.put("/:cid/products/:pid",async(req,res)=>{
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const product = await productDao.getById(pid)
        if (!product){ 
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` })
        };

        const cart = await cartDao.getById(cid);
        if (!cart){ 
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` })
        };
    
        const cartUpdate = await cartDao.updateQuantityProductInCart(cid, pid, Number(quantity));
    
        res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
})

cartsRoutes.delete("/:cid",authorization("admin"),async(req,res)=>{
    try {
        const { cid } = req.params
        const cart = await cartDao.clearProductsToCart(cid);
        if (!cart){ 
            return res.status(404).json({ status: "Error", msg: "Carrito no encontrado" })
        };
        res.status(200).json({cart});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
})

export default cartsRoutes;