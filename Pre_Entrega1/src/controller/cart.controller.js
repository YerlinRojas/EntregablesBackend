import { cartService, productService } from '../services/index.js'

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
    const cid = req.params.cid;
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
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

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
    const cid = req.params.cid;
    const pid = req.params.pid;

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
    const cid = req.params.cid;
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
    const cid = req.params.cid;
    const pid = req.params.pid;
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



export const purchaseCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.cartById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    //genero dos arrays para products comprados y no
    const purchasedProducts = [];
    const outOfStockProducts = [];


    // Verificar el stock de cada producto en el carrito
    for (const cartItem of cart.product) {
      const product = await productService.productById(cartItem.id._id);

      console.log("stock de product en cart", product.stock);
      console.log("cart item quantity", cartItem.quantity)
      console.log("Objet de cada product en el cart", cartItem.id)

      //itera en cada producto y regresa el stok OK
      

      if (!product) {
        return res.status(404).json({ error: `Product not found for ID ${cartItem.id}` });
      }//si no consigue el id product

      if (cartItem.quantity < product.stock) {

        purchasedProducts.push({
          product: product,
          quantity: cartItem.quantity,
        });
        //resta de products OK
        product.stock -= cartItem.quantity;
        //depuracion 
        console.log("----------------Updated stock for product:", product.stock);

        await product.save();
      } else {
        // Si no hay suficiente stock, agregar el producto a la lista de fuera de stock
        outOfStockProducts.push({
          product: product,
          requestedQuantity: cartItem.quantity,
          availableQuantity: product.stock,
        });
      }
    }
    const updatedCart = {
      _id: cart._id,
      product: purchasedProducts.map((item) => ({
        id: item.product._id,
        quantity: item.quantity,
      })),
    };
    console.log("---------------nuevo carrito despues de compra", updatedCart)
    //tiene que enviar el cart y ese cart solo contener los productos con estock
    res.status(200).json({
      message: 'Purchase completed successfully',
      purchasedProducts: purchasedProducts,
      outOfStockProducts: outOfStockProducts,
    });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


/* 
      

      
    }

    // Finalizar el proceso de compra
    // Aquí puedes agregar la lógica adicional, como crear un pedido, etc.

    // Borrar el carrito una vez que se haya completado la compra (si es necesario)
    await cartService.deleteAllProductsByCart(cid); */