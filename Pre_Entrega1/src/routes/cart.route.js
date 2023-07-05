import { Router } from "express";
import CartManager from "../manager/cart.manager.js";

const router = Router()
const cartManager = new CartManager()

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
})



export default router