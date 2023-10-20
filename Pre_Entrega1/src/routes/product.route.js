import { Router} from 'express'
import { createProduct, deleteProduct, getList, updateProduct, mockingProducts } from '../controller/product.controller.js'
import {typeError, routingError,dataBasesError} from '../midleware/error.js'

const router = Router()

//GET LIST PRODUCT
router.get('/',getList)

//CREATE PRODUCT
router.post('/create', typeError, routingError,dataBasesError,
 createProduct) 

//DELETE PRODUCT
router.get('/delete/:pid', deleteProduct)

//UPDATE PRODUCT
router.put('/:pid',updateProduct )

//MOCKING PRODUCTS
router.get('/mockingProducts', mockingProducts)


export default router

