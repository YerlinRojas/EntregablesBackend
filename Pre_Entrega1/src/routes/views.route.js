//contiene renderizaciones

import { Router } from "express";
import ProductManager from '../dao/manager/product.manager.js'
import productModel from "../dao/models/product.model.js";

const router = Router ()
const productManager = new ProductManager()

router.get('/' , (req, res) =>{
    res.render('index', {})
})

//esta ruta no renderiza por mongoose
router.get('/home', async(req,res)=>{
    try {
        const productsList = await productModel.find().lean().exec()
        console.log({productsList})
        res.render('home', {productsList})
   

    } catch (error) {
    console.error('Error obteniendo el producto:', error)
    res.status(500).json({ error: 'Internal server error' })
    }
    
})

//esta ruta no renderiza por mongoose 
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