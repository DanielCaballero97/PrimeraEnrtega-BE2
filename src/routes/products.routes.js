import { Router } from "express";
import { productDao } from "../mongo/product.dao.js"
import { uploader } from "../utils/multer.js"

const productsRouter = Router();

productsRouter.get('/',async (req,res)=>{
    const { page = 1, limit = 10} = req.query
    const products = await Product.paginate({},{page,limit})
    const result = {
        payload:products.docs,
        nextPage:products.nextPage,
        prevPage:products.prevPage,
        hasNextPage:products.hasNextPage,
        hasPrevPage:products.hasNextPage,
        nextLink: `/api/products/${products.nextPage}`,
        prevLink: `/api/products/${products.prevLink}`
    }
    res.json(result)
})


productsRouter.post('/',uploader.single('file'),async (req,res)=>{
    try {

        const body = req.body
        if (req.file) {
            body.img = req.file.originalname
        }
        await Product.create(body)
        res.json({message:'Product created'})

    } catch (error) {
        res.json(error)
    }
})




export default productsRouter;