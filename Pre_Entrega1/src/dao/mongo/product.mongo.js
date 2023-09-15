import productModel from '../mongo/models/product.model.js'


export default class Product {
    getList = async () => { 
        return await productModel.find() }

    createProduct = async(newProduct) => {
        return await productModel.create(newProduct)
    }
    productById= async(pid)=>{
        return await productModel.findOne({_id:pid})
    }
    saveProduct = async (product) =>{
        return await  product.save()
    }

    deleteProduct= async (pid) => {
        return await productModel.deleteOne({_id:pid})
    }

    updateProduct = async (pid,updatedFields ) => {
        return await productModel.updateOne(pid,updatedFields)
    }

}
