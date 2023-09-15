
import { productService } from "../services/index.js" 

export const getList=  async(req,res)=>{
    try {
        //se importa por user services
        const productsList = await productService.getList()
        console.log('Desde el back:',{productsList})
        res.send(productsList)
        
    } catch (error) {
        console.error('Error obteniendo producto:', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const createProduct =  async(req,res)=>{
    try {
        const newProduct = req.body
        console.log ('params from form:', {newProduct})

//se importa por user services
        const newProductGenerated = await productService.createProduct(newProduct)
        

        console.log ('new product from mongoose:', {newProductGenerated})
        res.redirect('/home')
    } catch (error) {
        console.error('Error al enviar producto:', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const deleteProduct =  async(req,res)=>{
    try {
        const {pid} = req.params.id
        console.log("DELETE PRODUCT id:", id);

        //se importa por user services
        const deleteProduct = await productService.deleteProduct(pid)
        res.redirect('/home')
    } catch (error) {
        console.error('Error al borrar productos', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const updateProduct = async(req,res)=>{
    try {
    const {pid} = req.params.pid
    const {updatedFields} = req.body

    console.log("UPDATE PRODUCT PID:",pid)
    console.log("UPDATE PRODUCT FIELDS:",updatedFields)

    //se importa por user services
    const result = await productService.updateProduct(pid,updatedFields)
    
    res.send(result)
    } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
}