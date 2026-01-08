import mongoose, { model } from "mongoose";

const productSchema = new mongoose.Schema(

    {
        productId : {
            type: String,
            required: true,
            unique: true 
        },

        name : {
            type: String,
            required: true
        },

        description : {
            type: String,
            required: true
        },

        altName : { 
            type: [String],
            default: [],
        },

        price : {   
            type: Number,
            required: true
        },

        labelledPrice: {
            type: Number,
        
        },
        category : {
            type: String,
            default : "others",
        },
        image : {
            type: [String],
            default: ["/images/default-product.png"],
        },

        isVisible : {
            type: Boolean,
            default: true,
        },

        isOnSale : {
            type: Boolean,
            default: false,
        },

        brand : {   
            type: String,
            default: "generic",
        },

        model : {   
            type: String,
            default: "standard",
        },


    }
)

const product = mongoose.model('product', productSchema);

export default product; 
