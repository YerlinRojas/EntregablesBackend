import CartDTO from "../dao/DTO/cart.dto.js";
import { cartService } from "./index.js";


export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }
    cartList = async () => {
        return await this.dao.cartList();
    };
    createCart = async () => {
        const insertCart = new CartDTO(this.dao);
        return await this.dao.createCart(insertCart);
    };
    cartById = async(cid) => {
        return this.dao.cartById(cid)
    }
    saveCart = async (cart) => {
        return await this.dao.saveCart(cart);
    };

    updatedCart = async (cid, update) => {
        return await this.dao.updatedCart(cid, update);
    };
    deleteCart = async (cid) => {
        return await this.dao.deleteCart(cid);
    };

    //SERVICES
    addProductByCart = async (cid, pid, quantity) => {

        const cart = await this.cartById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.product=[]
        const existingProduct = cart.product.find((product) => product.id === pid);
        if (existingProduct) {
        existingProduct.quantity += quantity;
        }else {
        cart.product.push({
        id: pid,
        quantity: quantity,
    });
    }
        await this.updatedCart(cid, cart);
        return cart;
    };

//revisar-------------------------------------------
    deleteProductByCart = async ( cid, pid,req) => {
        try {
          // Trae el cid y pid del controller
          //esta ok
          console.log("este es cid",cid);
          console.log("este es pid",pid);

          const cart = await cartService.cartById(cid);
          if (!cart) {
            throw new Error('Cart not found');
          }
       
          const productIndex = cart.product.findIndex((product) => product && product.id && product.id._id === pid);
          console.log(productIndex);
          if (productIndex === -1) {
            throw new Error('Product not found in cart');
            //entra aqui , no consigue el producto
          }
          cart.product.splice(productIndex, 1);
          
          await cart.save();
          return cart; 
        } catch (error) {
          throw error; // Lanza el error para que se maneje en el controlador
        }
      };
      


    quantityProductByCart = async (cid, pid) => {
        const cart = await this.cartById(cid)
        if (!cart) {
            throw new Error('Cart not Found');
        }
        const productIndex = cart.product.findIndex(product => product.id === pid);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }

        cart.product[productIndex].quantity = newQuantity;

        await this.saveCart(cart);

        return cart;

    }

    deleteAllProductsByCart = async (cid) => {
        const cart = await this.deleteCart(cid)
        return cart

    }
}
