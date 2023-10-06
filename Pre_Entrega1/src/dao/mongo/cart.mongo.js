
import CartModel from './models/cart.model.js'
import mongoose from 'mongoose'
import {logger} from '../../logger.js'

export default class Cart {
  cartList = async () => {
    return await CartModel.find()
  }
  createCart = async () => {
    return await CartModel.create({})
  }

  cartById = async (cid) => {
    
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return undefined;
      }
  
      const populatedCart = await CartModel.findOne({ _id: cid })
        .populate("product.id")
        .lean()
        .exec();
  
      logger.info("CartById Populate MONGO_DTO:", JSON.stringify(populatedCart, null, "\t"));

      return populatedCart;
    } catch (error) {
      logger.error("Error obteniendo el carrito por id:", error);
      throw error;
    }
  };
 
  saveCart = async (cart) => {
    if (!cart) {
      throw new Error("Cart not found");
    }
    const updatedCart = await CartModel.findOneAndUpdate(
      { _id: cart._id }, // Filtra el carrito por su ID
      { product: cart.product }, // Actualiza la lista de productos
      { new: true } // Devuelve el carrito actualizado
    );

    if (!updatedCart) {
      throw new Error('Cart not found');
    }
    return updatedCart;
};

  updatedCart = async (cid, updates) => {
    await CartModel.findOneAndUpdate(
      { _id: cid },
      {
        $push: {
          "product": updates.product 
        },
      },
      { new: true }
    );
  }




  deleteCart = async (cid) => {
    return await CartModel.findByIdAndDelete({ _id: cid })
  }



} 