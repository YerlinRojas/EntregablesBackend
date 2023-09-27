import { productService, cartService } from '../services/index.js'
import __dirname from '../utils.js';
import CustomError from '../services/errors/custom_error.js';
import EErrors from '../services/errors/enums.js';

export const productByCard = async (req, res) => {
  try {
    console.log("User after authentication: ", req.user);
    const user = req.user;


    //cart Id desde el passport register
    const cid = user.user.cartId; 
    //console.log("Este es el cid DESDE ProductByCart views.controller", cid);


    const allProducts = await productService.getList();

    // Pagination parameters
    const limit = parseInt(req.query?.limit || 10);
    const page = parseInt(req.query?.page || 1);

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the paginated subset of products
    const paginatedProducts = allProducts.slice(startIndex, endIndex)

    // Calculate pagination links
    const totalPages = Math.ceil(allProducts.length / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;


    res.render("products", {
      products:
      paginatedProducts,
      prevPage,
      nextPage,
      user,
      cid
    });
  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Error en Products view Internal server error" });
  }
};



export const listProduct = async (req, res) => {
  try {
    const allProducts = await productService.getList();

    // Pagination parameters
    const limit = parseInt(req.query?.limit || 10);
    const page = parseInt(req.query?.page || 1);

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the paginated subset of products
    const paginatedProducts = allProducts.slice(startIndex, endIndex)

    // Calculate pagination links
    const totalPages = Math.ceil(allProducts.length / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    console.log("productList, desde view.controller", paginatedProducts);


    //-----------------------------------------------------------
    res.render("home", {
      products:
      paginatedProducts,
      prevPage,
      nextPage,

    });

  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const createProduct = async (req, res) => {
  try {
    const newProduct = req.body

    if(!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.thumbnail || !newProduct.code || !newProduct.stock) {

      CustomError.createError({
          name: 'Product creation error',
          cause: generateProductErrorInfo(newProduct),
          message: 'Error trying to create product',
          code: EErrors.INVALID_TYPES_ERROR
      })
      
  }
    console.log('params from REQ BODY:', { newProduct })

    const newProductGenerated = await productService.createProduct(newProduct)

    console.log('new product from FRONT:', { newProductGenerated })
    res.redirect('/home')

  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export const addProductByCart = async (req, res) => {
  try {

   const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.params.quantity || 1;


    const addProductByCart = await cartService.addProductByCart(cid, pid, quantity)
    console.log("AddPorductByCart :", addProductByCart);

    res.redirect(`/cart/${cid}`); 

  } catch (error) {
    console.error("Error to add product at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const viewCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.cartById(cid);

    console.log("ESTE ES EL CART_", cart);
    let totalPrice = 0;

    for (const product of cart.product) {

      if (typeof product.id.price === 'number' && typeof product.quantity === 'number') {
        totalPrice += product.id.price * product.quantity;
      }
    }
    console.log("Este es el cart.product", cart.product);
    console.log("total price", totalPrice);

    res.render("carts", { cart, totalPrice });

  } catch (error) {
    console.error("Error obteniendo el carrito por id DESDE GET CARTID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    console.log("-----------cid, pid for delete", cid, pid);

    const cart = await cartService.cartById(cid, res)


     if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.product.findIndex((product) => product.id === pid);

    console.log("product.id?", product.id)

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.product.splice(productIndex, 1);

    console.log("Producto eliminado con cid:", cid, "y pid:", pid);


     res.redirect(`/${cid}`);
  } catch (error) {
    console.error("Error to delete products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



