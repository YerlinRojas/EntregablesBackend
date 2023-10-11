import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'product'

const productSchema = new mongoose.Schema({
    title : String,
    description: String,
    price: Number,
    category: String,
    thumbnail: String,
    code: Number,
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        }
})

productSchema.plugin(mongoosePaginate)

const productModel = new mongoose.model(productCollection, productSchema)


export default productModel