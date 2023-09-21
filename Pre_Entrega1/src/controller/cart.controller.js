import {cartService}  from '../services/index.js'

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart()

    console.log("Cart from createCart: ", { cart });
    res.send(cart);
  } catch (error) {
    console.error("Error to create cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cartById = async (req, res) => {
  try {
    const cid  = req.params.cid;
    const result = await cartService.cartById(cid);
    const populatedCart = await cartModel.findById(cid).populate("product.id");

    console.log("Populate from cartById: ", JSON.stringify(populatedCart, null, "\t"));
    res.send(result);
  } catch (error) {
    console.error("Error to get cartId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 

export const cartList = async (req, res) => {
  try {
    const cartList = await cartService.cartList();
    console.log("cartList from CartList: ", { cartList })
    res.status(200).json(cartList);
  } catch (error) {
    console.error("Error to get cartList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addProductByCart = async (req, res) => {
  try {
    const cid  = req.params.cid;
    const pid  = req.params.pid;
    const quantity  = req.body.quantity || 1;

    const cart = await cartService.cartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const addProductByCart = await cartService.addProductByCart(cid, pid, quantity)
    console.log("AddPorductByCart :", addProductByCart);

    
    res.send(addProductByCart);


    
  } catch (error) {
    console.error("Error to add product at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductByCart = async (req, res) => {
  try {
    const  cid  = req.params.cid;
    const  pid  = req.params.pid;

    const cart = await cartService.deleteProductByCart(cid, pid)
    cart.id = cid;

    console.log("delete Product by Cart :", { cart });
    res.send(cart);
  } catch (error) {
    console.error("Error to delete products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatedCart = async (req, res) => {
  try {
    const cid  = req.params.cid;
    const updatedFields = req.body;

    const result = await cartService.updatedCart(cid, updatedFields);
    console.log("update Cart:", result)
    res.send(result);
  } catch (error) {
    console.error("Error to update cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const quantityProductByCart = async (req, res) => {
  try {
    const  cid = req.params.cid;
    const  pid  = req.params.pid;
    const quantity = req.body;

    const cart = await cartService.quantityProductByCart(cid, pid, quantity)
    console.log("Quantity products by cart:", cart)
  } catch (error) {
    console.error("Error to quantityProducts at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//utiliza el find cart
export const deleteAllProductsByCart = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartService.deleteAllProductsByCart(cid)
    console.log("delete all products by cart:", { cart })

    res.send(cart);
  } catch (error) {
    console.error("Error to delete all products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const purchaseCart = async(req,res)=>{
  try {
    

    const cid = req.params.cid;
    const cart = await cartService.cartById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar el stock de cada producto en el carrito
    for (const cartItem of cart.product) {
      const product = await ProductModel.findById(cartItem.id);

      if (!product) {
        return res.status(404).json({ error: `Product not found for ID ${cartItem.id}` });
      }

      if (cartItem.quantity > product.stock) {
        // Si no hay suficiente stock, no agregar el producto al proceso de compra
        return res.status(400).json({ error: `Not enough stock for product ID ${cartItem.id}` });
      }

      // Restar la cantidad comprada del stock del producto
      product.stock -= cartItem.quantity;
      await product.save();
    }

    // Finalizar el proceso de compra
    // Aquí puedes agregar la lógica adicional, como crear un pedido, etc.

    // Borrar el carrito una vez que se haya completado la compra (si es necesario)
    await CartModel.findByIdAndDelete(cid);

    res.status(200).json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}