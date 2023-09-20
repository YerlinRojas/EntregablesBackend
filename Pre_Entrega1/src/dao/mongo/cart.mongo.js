import CartModel from './models/cart.model.js'
import mongoose from 'mongoose'

export default class Cart {
  cartList = async () => {
    return await CartModel.find()
  }
  createCart = async () => {
    return await CartModel.create({})
  }

   cartById = async (cid, res) => {
    console.log(cid)
    try {
 
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "ID de carrito no válido" });
      } 

      const cart = await CartModel.findOne({ _id: cid });
      
      if (!cart) {
        return res.status(404).json({ error: "Cart no encontrado" });
      }

      return cart;
    } catch (error) {

      console.error("Error obteniendo el carrito por id:", error);
      throw error;
    }
  };

  saveCart = async (cart) => {
    return await cart.save()
  }

  updatedCart = async (cid, updatedFields) => {
    return await CartModel.updateOne({ _id: cid }, updatedFields);
  }

  deleteCart = async (cid) => {
    return await CartModel.deleteOne({ _id: cid })
  }



}