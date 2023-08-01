//contiene renderizaciones

import { Router } from "express";
import ProductManager from '../dao/manager/product.manager.js'
import productModel from "../dao/models/product.model.js";

const router = Router ()
const productManager = new ProductManager()

router.get('/' , (req, res) =>{
    res.render('index', {})
})

//esta ruta renderiza 
router.get('/home', async(req,res)=>{
    try {
        //const productsList = await productModel.find().lean().exec() 
        /* console.log('desde front',{productsList}) */
        
        const limit = parseInt(req.query?.limit) || 10
        const page  = parseInt(req.query?.page) || 1 

        const productsList = await productModel.paginate({},{
            limit,
            page,
        })
        console.log(limit)

        productsList.prevLink = productsList.hasPrevPage ? `/?page=${productsList.prevPage}&limit=${limit}` : '';
        productsList.nextLink = productsList.hasNextPage ? `/?page=${productsList.nextPage}&limit=${limit}` : '';

        const result = await productModel.find().lean().exec() 

        res.render('home', {
            result,
            hasPrevPage: productsList.hasPrevPage,
            hasNextPage: productsList.hasNextPage,
            prevLink: productsList.prevLink,
            nextLink: productsList.nextLink,
        })

        console.log('Esto por paginate',{productsList})
        console.log('Esto por find()',{result})

    } catch (error) {
    console.error('Error obteniendo el producto:', error)
    res.status(500).json({ error: 'Internal server error' })
    }
    
})

//esta ruta renderiza 
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