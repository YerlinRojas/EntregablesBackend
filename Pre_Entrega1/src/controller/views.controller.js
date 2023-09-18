import {productService,cartService} from '../services/index.js'




export const productByCard = async (req, res) => {
    try { 
      console.log("User after authentication: ", req.user);
      const user = req.user
      
       //cart Id desde el passport register
      const cartId = user.user.cartId;
      //----------------------------------------------------------------
      //opciones de filtrado
      const limit = parseInt(req.query?.limit || 10);
      const page = parseInt(req.query?.page || 1);
  
      const sortOrder =
        req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
      const sort = { price: sortOrder };
  
      const field = req.query.field || "";
      const value = req.query.value || "";
      const query = {};
      if (field && value) {
        if (!isNaN(parseInt(value))) {
          query[field] = parseInt(value);
        } else {
          query[field] = value;
        }
      }
  
      const productsList = await cartService.cartList().paginate(query, {
        limit,
        page,
        lean: true,
        sort,
      });
  
      productsList.prevLink = productsList.hasPrevPage
        ? `/products?page=${productsList.prevPage}&limit=${limit}`
        : "";
      productsList.nextLink = productsList.hasNextPage
        ? `/products?page=${productsList.nextPage}&limit=${limit}`
        : "";
  
  
  
      //-----------------------------------------------------------
      res.render("products", { products: productsList, cartId, user });
    } catch (error) {
      //console.error("Error obteniendo el producto:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


export const listProduct = async (req, res) => {
    try {
      const limit = parseInt(req.query?.limit || 10);
      const page = parseInt(req.query?.page || 1);
  
      const sortOrder =
        req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
      const sort = { price: sortOrder };
  
      const field = req.query.field || "";
      const value = req.query.value || "";
      const query = {};
      if (field && value) {
        if (!isNaN(parseInt(value))) {
          query[field] = parseInt(value);
        } else {
          query[field] = value;
        }
      }
  
      const productsList = await cartService.cartList().paginate(query, {
        limit,
        page,
        lean: true,
        sort,
      });
  
      productsList.prevLink = productsList.hasPrevPage
        ? `/home?page=${productsList.prevPage}&limit=${limit}`
        : "";
      productsList.nextLink = productsList.hasNextPage
        ? `/home?page=${productsList.nextPage}&limit=${limit}`
        : "";
  
      res.render("home", productsList);
    } catch (error) {
      console.error("Error obteniendo el producto:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


export const createProduct = async (req, res) => {
    try {
      const products = await productService.createProduct();
      res.render("realtimeproducts", { products });
    } catch (error) {
      console.error("Error obteniendo el producto:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

export const viewCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.cartById(cid)

    const populatedCart = await cart.populate("product.id").lean().exec();
    console.log("ESTE ES EL CART POPULATE:", JSON.stringify(populatedCart, null, "\t"))

  if (!populatedCart) {
      return res.status(404).json({ error: "Cart no encontrado" });
    }
 
    res.render("carts", {populatedCart});
    
  } catch (error) {
    console.error("Error obteniendo el carrito por id DESDE GET CARTID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



