import { Router } from 'express'
import ProductManager from '../manager/product.manager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async(req,res)=>{
    try {
        const result = await productManager.getProduct()
    res.send(result)
    } catch (error) {
    console.error('Error obteniendo el producto:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
})


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


export default router
