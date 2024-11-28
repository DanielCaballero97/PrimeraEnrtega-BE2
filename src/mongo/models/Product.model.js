import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    
    description:{
        type:String,        
        required:true
    },

    status:{
        type:Boolean,
        default:true
    },

    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:Array,
        required:true,
        default:[]
    },

    thumbnail:{
        type:String,
        default:""
    },

    img:{
        type:String,
        required:true,
        default:"custom.jpg"
    }
})

ProductSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model('Product', ProductSchema);