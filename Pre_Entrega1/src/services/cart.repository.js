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

    updatedCart = async (cid, updatedFields) => {
        return await this.dao.updatedCart(cid, updatedFields);
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
        cart.product.push({
            id: pid,
            quantity: quantity,
        });
        await this.saveCart(cart);
        return cart;
    };


    deleteProductByCart = async (cid, pid) => {
        const cart = await this.cartById(cid);
        if (!cart) {
            throw new Error('Cart not Found');
        }
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
        const cart = await this.cartById(cid)
        if (!cart) {
            throw new Error('Cart not Found');
        }
        cart.product = [];
        await cart.save();
        return cart

    }
}
