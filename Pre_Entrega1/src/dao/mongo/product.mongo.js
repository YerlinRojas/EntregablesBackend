import ProductModel from '../dao/mongo/models/product.model.js'


export default class Product {
    getList = async () => { 
        return await ProductModel.find() }

    createProduct = async(newProduct) => {
        return await ProductModel.create(newProduct)
    }
    productById= async(pid)=>{
        return await ProductModel.findOne({_id:pid})
    }
    saveProduct = async (product) =>{
        return await  product.save()
    }

    deleteProduct= async (pid) => {
        return await ProductModel.deleteOne({_id:pid})
    }

    updateProduct = async (pid,updatedFields ) => {
        return await ProductModel.updateOne(pid,updatedFields)
    }

}
