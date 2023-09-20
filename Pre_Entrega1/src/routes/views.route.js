//contiene renderizaciones

import { Router } from "express";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import { addProductByCart, createProduct, listProduct, productByCard,  viewCartById,deleteProductByCart  } from "../controller/views.controller.js";
import config from "../config/config.js";

const COOKIE_KEY = config.COOKIE_KEY
const router = Router();

//Funcion de autorizacion por  SESSION
function auth(req, res, next) {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

//INDEX
router.get("/", (req, res) => {
  res.render("index", {});
});

//ROUTE GOOGLE ------------
router.get(
  "/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, }),
  async (req, res) => {}
);

router.get(
  "/callback-google",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {

      const access_token = generateToken(req.user);

      res.cookie(COOKIE_KEY, access_token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true
      });

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
          
      const access_token = generateToken(req.user);

            res.cookie(COOKIE_KEY, access_token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            });

            if (req.user && req.user.role === 'admin') {
              // Si el usuario es administrador, redirigir a /home
              return res.redirect('/home');
          } else {
              // Si el usuario no es administrador, redirigir a /products
              console.log("CALLBACK GITHUB TOKEN: ", req.user.token);
              return res.redirect('/products');
              
          }

            
      
    } catch (e) {
      console.error("error git call back", e);
      
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



//PRODUCTS EN CARDS SOLO AUTORIZA -user-
router.get('/products',
passportCall('jwt'),authorization('user'),
productByCard);

router.post("/:cid/product/:pid",passportCall('jwt'), authorization('user'),
addProductByCart
);


//LISTADO DE PRODUCTS AUTORIZA -admin-
router.get('/home', passportCall('jwt'), authorization('admin'), 
listProduct
);

//CREA PRODUCTS AUTORIZA -admin-
router.get("/realtimeproducts",passportCall('jwt'), authorization('admin'),
(req,res)=>{
  res.render("realtimeproducts",{})
}
);
router.post("/realtimeproducts",passportCall('jwt'), authorization('admin'),
createProduct
);



// CARRITO POR ID VIEW -user-
router.get("/:cid", viewCartById); 

router.get("/:cid/product/:pid", deleteProductByCart)

export default router;
