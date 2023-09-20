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
    console.log("CART BY ID: ",cid);
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "ID de carrito no válido" });
      }
  
      const populatedCart = await CartModel.findOne({ _id: cid })
        .populate("product.id")
        .lean()
        .exec();
  
      console.log("ESTE ES EL CART POPULATE:", JSON.stringify(populatedCart, null, "\t"));
  
      
  
      return populatedCart;
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