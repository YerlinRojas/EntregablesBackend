import { productService, cartService, userService } from "../services/index.js";
import __dirname from "../utils.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { logger } from "../logger.js";
import { productBelongsToUser } from "../module/productBelongsToUser.js";

export const productByCard = async (req, res) => {
  try {
    logger.info("User after authentication: ", req.user);
    const user = req.user;

    const cid = user.user.cartId;
    const allProducts = await productService.getList();

    // Pagination parameters
    const limit = parseInt(req.query?.limit || 10);
    const page = parseInt(req.query?.page || 1);

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the paginated subset of products
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    // Calculate pagination links
    const totalPages = Math.ceil(allProducts.length / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    logger.http("Solicitud HTTP exitosa en /products");
    res.render("products", {
      products: paginatedProducts,
      prevPage,
      nextPage,
      user,
      cid,
    });
  } catch (error) {
    logger.error("Error obteniendo el producto:", error);
    res
      .status(500)
      .json({ error: "Error en Products view Internal server error" });
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
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    // Calculate pagination links
    const totalPages = Math.ceil(allProducts.length / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    logger.info("ProductList", paginatedProducts);

    logger.http("Solicitud HTTP exitosa en /home");
    //-----------------------------------------------------------
    res.render("home", {
      products: paginatedProducts,
      prevPage,
      nextPage,
    });
  } catch (error) {
    logger.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const userId = req.user.user;
   
    console.log(newProduct.thumbnail)
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.thumbnail||
      !newProduct.code ||
      !newProduct.stock
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(newProduct),
        message: "Error trying to create product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    // Verificar existencia de thumbnail
    if (!newProduct.thumbnail) {
      return res.status(400).json({ error: "El campo 'thumbnail' es obligatorio" });
    }
    logger.info("PARAMS FROM REQUEST");
    
    const user = await userService.userById(userId);

    if (!user) {
        logger.error("OWNER FOR PRODUCT NO FIND");
    }
    newProduct.owner = user._id;
   console.log("este usuario creo el product", user._id);
   
    const newProductGenerated = await productService.createProduct(newProduct); 
    
    
    logger.http("Solicitud HTTP exitosa en /realtimeproducts");
    logger.info("New Product CREATE", { newProduct });
    res.redirect("/home");
  } catch (error) {
    logger.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
      const pid = req.params.pid;
      logger.info("Product by ID from Delete:", pid);
      const deleteProduct = await productService.deleteProduct(pid);

      logger.http('Solicitud HTTP exitosa en /delete/:pid');
      res.redirect('/home');
  } catch (error) {
      logger.error("Error al borrar productos", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

//-------------------------------ACA

export const addProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.params.quantity || 1;

     const user = req.user.user;
     console.log("USER ADD REQ" , user);

     // Verifica si el usuario es premium y si el producto le pertenece
     if (user && user.role === "premium") {
       // Aquí debes implementar la lógica para verificar si el producto pertenece al usuario
       const productBelongs = await productBelongsToUser(pid, user._id);
 
       if (productBelongs) {
         return res.status(403).json({ error: "Premium users cannot add their own products to the cart." });
       }
     } 

    const addProductByCart = await cartService.addProductByCart(
      cid,
      pid,
      quantity
    );
    logger.info("AddPorductByCart :", addProductByCart);
    logger.http("Solicitud HTTP exitosa en /addProduct/:cid/product/:pid");
    res.redirect(`/cart/${cid}`);
  } catch (error) {
    logger.error("Error to add product at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//SI ES PRIMIUM NO PUEDO ACCEDER A LAS PROPIEDADES DEL CARRITO

export const viewCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.cartById(cid);

    logger.info("CART BY ID", cart);
    console.log("CARRITO ViewCartByID", cart);

    let totalPrice = 0;

    for (const product of cart.product) {
     
      const productPrice = parseFloat(product.id.price);

      if (
        !isNaN(productPrice) &&  
        typeof product.quantity === "number"
      ) {
        totalPrice += productPrice * product.quantity;
      }
    }

    logger.info("CART WITH PRODUCTS", cart.product);
    logger.info("TOTAL PRICE:", totalPrice);
    logger.http("Solicitud HTTP exitosa en /cart/:cid");
    
    res.render("carts", { cart, totalPrice });
  } catch (error) {
    logger.error("Error obteniendo el carrito por id DESDE GET CARTID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    logger.info("Params from REQ cid & pid", cid, pid);

    await cartService.deleteProductByCart(cid, pid);
    logger.http("Solicitud HTTP exitosa en /cart/delete/:cid/product/:pid");

    res.redirect(`/cart/${cid}`);
  } catch (error) {
    logger.error("Error to delete products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

 export const userRole = async (req, res)=>{
  try {
    logger.http("solicitud HTPP exitosa en /userRole")
    res.render('userRole')    
  } catch (error) {
    logger.error("Error to render userRole", error);
    res.status(500).json({ error: "Internal server error" });
  }
  }