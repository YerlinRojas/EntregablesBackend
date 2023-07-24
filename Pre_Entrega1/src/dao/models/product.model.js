import mongoose from 'mongoose'

const productCollection = 'product'

const productSchema = new mongoose.Schema({
    id: Number,
    title : String,
    description: String,
    price: Number,
    category: String,
    thumbnail: String,
    code: Number,
    stock: Number,
})

const productModel = new mongoose.model(productCollection, productSchema)

export default productModel