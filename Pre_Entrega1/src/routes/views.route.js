
import { Router } from "express";
import compression from 'express-compression'
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import { addProductByCart, createProduct, listProduct, productByCard,  viewCartById,deleteProductByCart, deleteProduct } from "../controller/views.controller.js";
import config from "../config/config.js";
import {routingError, dataBasesError, cartNotFoundError, typeError} from '../midleware/error.js'
import { authorizeDelete } from "../midleware/authorizeDelete.js";


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
      logger.http('Solicitud HTTP exitosa en /callback-google');
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
              logger.http('Solicitud HTTP exitosa en /githubcallback');
              
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
router.get("/register", 
typeError,
(req, res) => {
  if (req.session?.user) {
    res.redirect("/products");
  }
  res.render("register", {});
});

const allowedRolesUser = ['user','premium']

//PRODUCTS EN CARDS SOLO AUTORIZA -user-
router.get('/products',
passportCall('jwt'),
authorization(allowedRolesUser),
compression({brotli: {enabled: true, zlib: {}}}),
routingError,
dataBasesError,
productByCard);


router.post("/addProduct/:cid/product/:pid",passportCall('jwt'), authorization(allowedRolesUser),
routingError, cartNotFoundError,
addProductByCart
);


// VISTA DEL CARRITO -user-
router.get("/cart/:cid", routingError, cartNotFoundError, viewCartById); 

router.post("/cart/delete/:cid/product/:pid", routingError, cartNotFoundError, deleteProductByCart)


const allowedRoles = ['premium', 'admin'];
//LISTADO DE PRODUCTS AUTORIZA -admin-
router.get('/home', passportCall('jwt'), authorization(allowedRoles), 
routingError, cartNotFoundError, dataBasesError,
listProduct
);


router.get('/delete/:pid', passportCall('jwt'), authorizeDelete(allowedRoles), 
routingError, cartNotFoundError, dataBasesError,
deleteProduct
);




//CREA PRODUCTS AUTORIZA -admin-
router.get("/realtimeproducts",passportCall('jwt'), authorization(allowedRoles),
(req,res)=>{
  res.render("realtimeproducts",{})
}
);
router.post("/realtimeproducts",passportCall('jwt'), authorization(allowedRoles),
routingError, cartNotFoundError, typeError,
createProduct
);

export default router;
