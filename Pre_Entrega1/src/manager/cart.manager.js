import FileManager from './file.manager.js';

export default class CartManager extends FileManager {
  constructor() {
    super('./carts.json');
  }

  createCart = async () => {
    const cartId = await this.getNewCartId();
    const cart = {
      id: cartId,
      products: []
    };
    await this.write([...await this.read(), cart]);
    return cart;
  };

  listCart = async () => {
    const cart = await this.read();
    if (cart) {
      return cart
    }
    return null;
  }

  getCartById = async (cartId) => {
    const carts = await this.read();
    return carts.find(cart => cart.id === cartId);
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const carts = await this.listCart();
    const cart = carts.find(cart => cart.id === cartId);
    if (cart) {
      const existingProduct = cart.products.find(product => product.id === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity
      } else {
        cart.products.push({
          id: productId,
          quantity: quantity
        });
      }
      await this.write(carts)
      return cart
    }
    return null
  }

  getNewCartId = async () => {
    const carts = await this.read();
    const lastCart = carts.length > 0 ? carts[carts.length - 1] : null;
    const lastCartId = lastCart ? lastCart.id : 0;
    return lastCartId + 1;
  }
}
