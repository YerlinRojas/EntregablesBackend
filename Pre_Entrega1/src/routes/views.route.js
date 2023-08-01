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
        
        const limit = parseInt(req.query?.limit) || 10
        const page  = parseInt(req.query?.page) || 1 

        const sortOrder = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null
        const sort = {price: sortOrder}

        const productsList = await productModel.paginate({},{
            limit,
            page,
            lean: true,
            sort,
            
        })

        
        
        productsList.prevLink = productsList.hasPrevPage ? `/home?page=${productsList.prevPage}&limit=${limit}` : '';
        productsList.nextLink = productsList.hasNextPage ? `/home?page=${productsList.nextPage}&limit=${limit}` : '';



        res.render('home',productsList)

        console.log('Esto por paginate',{productsList})
        
    

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