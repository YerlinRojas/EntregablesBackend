
import CartModel from './models/cart.model.js'
import mongoose from 'mongoose'

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
  
      console.log("ESTE ES EL CART POPULATE:", JSON.stringify(populatedCart, null, "\t"));
  
      
  
      return populatedCart;
    } catch (error) {
      console.error("Error obteniendo el carrito por id:", error);
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



  /* deleteProductByCart = async (cid, pid) => {
    try {
      // Busca el carrito por su ID
      const cart = await CartModel.findById(cid);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const productIndex = cart.product.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
      // Elimina el producto del carrito
      cart.product.splice(productIndex, 1);
      // Guarda el carrito actualizado en la base de datos
      await cart.save();
      return cart; // Devuelve el carrito actualizado
    } catch (error) {
      throw error; // Lanza el error para que se maneje en el controlador
    }
  }; */

}