import mongoose, { Schema } from "mongoose"

const cartCollection = 'cart'


const cartSchema = new mongoose.Schema({
    product: {
        type:[{
            id: String,
            quantity: Number
        }]
    }
})

const cartModel = new mongoose.model(cartCollection,cartSchema)

export default cartModel