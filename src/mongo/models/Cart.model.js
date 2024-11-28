import mongoose from "mongoose"

const CartSchema = new mongoose.Schema({
    products:{
        type:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
                required:true
            },
        }],
        default:[]
    }
})

CartSchema.pre(["find","findOne","findById"],function(){
    this.populate("products.product")
})

export const cartModel = mongoose.model('Cart', CartSchema);