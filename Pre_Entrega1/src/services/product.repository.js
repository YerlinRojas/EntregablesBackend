import ProductDTO from '../dao/DTO/product.dto.js'

export default class ProductRepository{
    constructor(dao){
        this.dao= dao
    }

    getList = async () => { 
        return await this.dao.getList() }

    createProduct = async(newProduct) => {
        const productInsert = new ProductDTO(newProduct)
        return await this.dao.createProduct(productInsert)
    }
    productById= async(pid)=>{
        return await this.dao.productById(pid)
    }
    saveProduct = async () =>{
        return await  this.dao.saveProduct()
    }

    deleteProduct= async (pid) => {
        return await this.dao.deleteProduct(pid)
    }

    updateProduct = async (pid,updatedFields ) => {
        return await this.dao.updateProduct(pid,updatedFields)
    }
}