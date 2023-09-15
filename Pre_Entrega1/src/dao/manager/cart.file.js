import FileManager from './file.manager.js';

export default class Cart extends FileManager {
  constructor(filename = "./db.cart.json") {
    super(filename)
  }
  
  cartList = async () => {
    return await this.get()
  }
  
  createCart = async () => {
      const cart = {
      id: await this.getNewCartId(),
      products: []
    };
    await this.write([...await this.get(), cart]);
    return cart;
  };

  cartById = async (id) => {
    return await this.getById(id)
  };

  getNewCartId = async () => {
    const carts = await this.get();
    const lastCart = carts.length > 0 ? carts[carts.length - 1] : null;
    const lastCartId = lastCart ? lastCart.id : 0;
    return lastCartId + 1;
  }


saveCart = async (cart) => {
  try {
      const list = await this.get(); 
      const updatedList = list.map(item => {
          if (item.id === cart.id) {
              return cart; 
          }
          return item;
      });
      await this.write(updatedList); 
      return cart; 
  } catch (error) {
      console.error(`Error saving cart data: ${error}`);
      throw error;
  }
}

updateCart = async (id, updateFields) => {
  updateFields.id=id
  return await this.update(id, updateFields)
}

deleteCart= async (id)=>{
try {
return await this.delete(id)
} catch (error) {
    console.log("Cart not found.");
    return false;

}
}

}