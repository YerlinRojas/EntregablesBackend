import CartDTO from "../dao/DTO/cart.dto.js";


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
    cartById = async (cid) => {
        return await this.dao.cartById(cid);
    };
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
        const existingProduct = cart.product.find((product) => product.id === pid);

         if (existingProduct) {
      // Si el producto ya está en el carrito, actualizar la cantidad
          existingProduct.quantity += quantity;
    }    else {
          // Si el producto no está en el carrito, agregarlo
          cart.product.push({
        id: pid,
        quantity: quantity,
      });
    }

        await this.updatedCart(cid, cart);
        //await this.saveCart(cart)
        //aca no puedo salvar el actual carrito con los productos adentro
        return cart;
    };

    

    deleteProductByCart = async (cid, pid) => {
        const cart = await this.cartById(cid);
        if (!cart) {
            throw new Error('Cart not Found');
        }
        const pidString = pid.toString();

        console.log("esto es pid", pidString);
        const productIndex = cart.product.findIndex(product => product.id === pid);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }
        cart.product.splice(productIndex, 1);
        await this.saveCart(cart);
        return cart;
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
       const cart = await this.deleteCart (cid)
       return cart

    } 
}
