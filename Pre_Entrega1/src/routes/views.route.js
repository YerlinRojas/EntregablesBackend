//contiene renderizaciones

import { Router } from "express";
import ProductManager from '../manager/product.manager.js'

const router = Router ()
const productManager = new ProductManager()

router.get('/' , (req, res) =>{
    res.render('index', {})
})

router.get('/home', async(req,res)=>{
    try {
    const products = await productManager.getProduct()
    res.render('home', { products });

    } catch (error) {
    console.error('Error obteniendo el producto:', error)
    res.status(500).json({ error: 'Internal server error' })
    }
    
})

router.get('/realtimeproducts', async(req, res) => {
    try {
        const products = await productManager.getProduct()
        res.render('realtimeproducts', { products });

    } catch (error) {
        console.error('Error obteniendo el producto:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})



export default router