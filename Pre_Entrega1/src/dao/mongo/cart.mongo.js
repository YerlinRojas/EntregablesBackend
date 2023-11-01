
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

  deleteProductByCart = async (cid, pid) => {
    try {
      const cart = await CartModel.findOne({ _id: cid });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      // Busca el índice del producto en el carrito por su ID.
      const productIndex = cart.product.findIndex(product => product._id.toString() === pid);
  
      if (productIndex === 1) {
        throw new Error('Product not found in cart');
      }
  
      // Elimina el producto del carrito.
      cart.product.splice(productIndex, 1);
  
      // Guarda el carrito actualizado en la base de datos.
      await cart.save();
  
    } catch (error) {
      throw error;
    }
  };
  

} 