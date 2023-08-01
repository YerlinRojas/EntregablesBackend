import { Router, query } from 'express'
import ProductManager from '../dao/manager/product.manager.js'
import productModel from '../dao/models/product.model.js'

const router = Router()



//funcion mongoose list
router.get('/', async(req,res)=>{
    try {
        const productsList = await productModel.find()
        console.log('Desde el back:',{productsList})
        res.send(productsList)
        
    } catch (error) {
        console.error('Error obteniendo producto:', error)
        res.status(500).json({error: 'Internal server error'})
    }
})



//funcion mongoose crear
router.post('/create', async(req,res)=>{
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
}) 



//funcion mongoose delete
router.get('/delete/:id', async(req,res)=>{
    try {
        const id = req.params.id
        await productModel.deleteOne({_id:id})
        res.redirect('/home')
    } catch (error) {
        console.error('Error al borrar productos', error)
        res.status(500).json({error: 'Internal server error'})
    }
})


//update actualizar
router.put('/:pid', async(req,res)=>{
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
    
})


export default router






//const productManager = new ProductManager()
/* 
 router.get('/', async(req,res)=>{
    try {
    
    const result = await productManager.getProduct()
    res.send(result)
    } catch (error) {
    console.error('Error obteniendo el producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
}) 

//fromulario crea
router.post('/', async(req,res)=>{
    try {
    const data = req.body
    const result = await productManager.addProduct(data)
    res.send(result)
    } catch (error) {
    console.error('Error al enviar el producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
})


router.get('/:pid', async(req,res)=>{
    try {
    const pid = parseInt(req.params.pid)
    const result = await productManager.getProductById(pid)
    res.send(result)
    } catch (error) {
    console.error('Error obteniendo el producto por id:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
})  

router.put('/:pid', async(req,res)=>{
    try {
        const pid = parseInt(req.params.pid)
    const updatedFields = req.body
    console.log(pid)
    console.log(updatedFields)
    const result = await productManager.updateProduct(pid,updatedFields)
    res.send(result)
    } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
})


router.delete('/:pid', async(req,res)=>{
    try {
    const pid = parseInt(req.params.pid)
    const result = await productManager.deleteProduct(pid)
    res.send(result)
    } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
  
})
 */