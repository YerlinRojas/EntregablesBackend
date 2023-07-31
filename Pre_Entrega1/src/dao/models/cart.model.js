import mongoose, { Schema } from "mongoose"

const cartCollection = 'cart'


const cartSchema = new mongoose.Schema({
    product: {
        type:[{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product' 
            },
            quantity: Number
        }]
    }
})

const cartModel = new mongoose.model(cartCollection,cartSchema)

export default cartModel