import productModel from '../dao/models/product.model.js'


export const getList=  async(req,res)=>{
    try {
        const productsList = await productModel.find()
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
        const newProductGenerated = new productModel(newProduct)
        await newProductGenerated.save()

        console.log ('new product from mongoose:', {newProductGenerated})
        res.redirect('/home')
    } catch (error) {
        console.error('Error al enviar producto:', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const deleteProduct =  async(req,res)=>{
    try {
        const id = req.params.id
        await productModel.deleteOne({_id:id})
        res.redirect('/home')
    } catch (error) {
        console.error('Error al borrar productos', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const updateProduct = async(req,res)=>{
    try {
    const pid = req.params.pid
    const updatedFields = req.body

    console.log(pid)
    console.log(updatedFields)

    const result = await productModel.updateOne(pid,updatedFields)
    
    res.send(result)
    } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
}