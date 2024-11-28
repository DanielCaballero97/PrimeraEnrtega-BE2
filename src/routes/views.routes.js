import { Router } from "express";
//import Product from "../mongo/models/Product.model.js";
//import Cart from "../mongo/models/Cart.model.js"

const viewsRouter = Router();


viewsRouter.get("/",(req,res)=>{
    res.render("home")
})

viewsRouter.get("/carts/:cid",async (req,res)=>{
    try {
        const { cid } = req.params;
        const cart = await Cart.findOne({_id:cid}).populate();
        res.status(200).render("cartView",{cart})
    } catch (error) {
        res.json(error)
    }

})

viewsRouter.get('/products',async (req,res)=>{
    try {
        const { page = 1, limit = 10, filter , sortOrder} = req.query
        const products = await Product.paginate({},{page , limit , sort:(`${filter} ${sortOrder}`)})
        const result = {
            payload:products.docs,
            nextPage:products.nextPage,
            prevPage:products.prevPage,
            hasNextPage:products.hasNextPage,
            hasPrevPage:products.hasNextPage,
            nextLink: `?page=${products.nextPage}&limit=${limit}&filter=${filter}&sortOrder=${sortOrder}`,
            prevLink: `?page=${products.prevPage}&limit=${limit}&filter=${filter}&sortOrder=${sortOrder}`,
            totalPages:products.totalPages,
            page:products.page
        }
    res.status(200).render('index',{result})
    } catch (error) {
        res.json(error)
    }
})


export default viewsRouter;

