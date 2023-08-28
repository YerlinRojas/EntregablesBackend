//contiene renderizaciones

import { Router } from "express";
import ProductManager from "../dao/manager/product.manager.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";
import passport from "passport";
import { generateToken, authToken, passportCall, authorization } from "../utils.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", (req, res) => {
  res.render("index", {});
});

//ROUTE GOOGLE ------------
router.get(
  "/login-google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  async (req, res) => {}
);

router.get(
  "/callback-google",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      console.log("CALLBACK GOOGLE: ", req.user);
      req.session.user = req.user;
      console.log(req.session);
      res.redirect("/products");
    } catch (error) {
      console.error("error google call back", error);
    }
  }
);

//ROUTER GITHUB--------------------
router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      console.log("CALLBACK GITHUB: ", req.user);
      
      res.cookie('coderCookie', req.user.token).redirect("/products");
    } catch (error) {
      console.error("error git call back", error);
    }
  }
);


//LOGIN render------------------------
router.get("/login", (req, res) => {
  //si esta logeado entra al los products
  if (req.session?.user) {
    res.redirect("/products");
  }

  res.render("login", {});
});

//REGISTER render----------------
router.get("/register", (req, res) => {
  if (req.session?.user) {
    res.redirect("/products");
  }
  
  res.render("register", {});
});

//esta autorizacion es para saber si el user esta
//logeado pasa
//sino esta registrado manda al login
function auth(req, res, next) {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}



//PRODUCTS EN CARDS SOLO AUTORIZA EVERYONE
router.get('/products',
passportCall('jwt'), 
async (req, res) => {
  try {
    //parametros de user
    const user = req.session.user;

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

    const productsList = await productModel.paginate(query, {
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
    //-------------------------------------------------------------
    const cartListAll = await cartModel.find();
    let cartId;

    if (cartListAll.length > 0) {
      cartId = cartListAll[0]._id;
    } else {
      const cartList = new cartModel();
      const cart = await cartList.save();
      cartId = cart._id;
      console.log(cartId);
    }
    //-----------------------------------------------------------
    res.render("products", { products: productsList, cartId, user });
  } catch (error) {
    //console.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//LISTADO DE PRODUCTS AUTORIZA ADMIN
router.get('/home', passportCall('jwt'), authorization('admin'),
async (req, res) => {
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

    const productsList = await productModel.paginate(query, {
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
});

//CREA PRODUCTS AUTORIZA ADMIN
router.get("/realtimeproducts",passportCall('jwt'), authorization('admin'),
async (req, res) => {
  try {
    const products = await productManager.getProduct();
    res.render("realtimeproducts", { products });
  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vista del carrito específico
router.get("/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartModel.findById(cartId).lean().exec();

    if (!cart) {
      return res.status(404).json({ error: "Cart no encontrado" });
    }

    res.render("carts", { cart });
  } catch (error) {
    console.error("Error obteniendo el carrito por id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
