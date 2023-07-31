import { Router } from "express";
import cartManager from "../dao/manager/cart.manager.js";
import cartModel from '../dao/models/cart.model.js'


const router = Router()
//const cartManager = new CartManager()
//postman

//crear carrito
router.post('/',async(req,res)=>{
    try {
    const cartList = new cartModel()
    await cartList.save()
    console.log({cartList})
    res.status(200).json(cartList);
    
    } catch (error) {
        console.error('Error al enviar el producto:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}) 

//CART POR ID   
router.get('/:cid',async(req,res)=>{
    try {
    const cid = req.params.cid
    const result = await cartModel.findById(cid)
    res.send(result)
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Cart no encontrado' })
    }    
    } catch (error) {
        console.error('Error al obtener producto por id:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}) 

//LISTADO cart
router.get('/',async(req,res)=>{
    try {
    
    const cartList = await cartModel.find()
    console.log({cartList}) 
    res.status(200).json(cartList);
    
    } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
}) 

//agrega productos a la lista de carritos
router.post('/:cid/product/:pid', async (req, res) => {
    try {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.query.quantity || 1

    const cart = await cartModel.findById(cid)
    await cart.product.push({id: pid, quantity})
    const result = await cart.save()
    res.send(result)

     const populatedCart = await cartModel.findById(cid).populate('product.id')

    console.log(JSON.stringify(populatedCart, null, '\t'))
    
   
    } catch (error) {
    console.error('Error agregando producto :', error);
    res.status(500).json({ error: 'Internal server error' })
    }
})



export default router


/* 
file manager
router.post('/',async(req,res)=>{
    try {
    const result = await cartManager.createCart()
    res.send(result) 
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Cart no encontrado' })
    }   
    } catch (error) {
        console.error('Error al enviar el producto:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}) 

router.get('/:cid',async(req,res)=>{
    try {
    const cid = parseInt (req.params.cid)
    const result = await cartManager.getCartById(cid)
    res.send(result)
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Cart no encontrado' })
    }    
    } catch (error) {
        console.error('Error al obtener producto por id:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
  
}) 

router.get('/',async(req,res)=>{
    try {
    const result = await cartManager.listCart()
    res.send(result) 
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Cart no encontrado' })
    }   
    } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Internal server error' })
    }
    
}) 

router.post('/:cid/product/:pid', async (req, res) => {
    try {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const quantity = 1

    const result = await cartManager.addProductToCart(cid, pid, quantity)
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Cart no encontrado' })
    }
    } catch (error) {
    console.error('Error agregando producto :', error);
    res.status(500).json({ error: 'Internal server error' })
    }
}) */