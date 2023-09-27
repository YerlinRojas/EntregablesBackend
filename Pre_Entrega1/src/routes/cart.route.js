import { Router } from "express";
import{ deleteAllProductsByCart, addProductByCart, cartById, cartList, createCart, deleteProductByCart, quantityProductByCart, purchaseCart, updatedCart } from '../controller/cart.controller.js'
import { passportCall } from "../utils.js";
import { dataBasesError, cartNotFoundError, routingError} from '../midleware/error.js'

const router = Router();

//crear carrito
router.post("/", dataBasesError, routingError, createCart);

//CART POR ID
router.get("/:cid", cartNotFoundError, cartById);

//LISTADO cart
router.get("/",cartNotFoundError, cartList);

//agrega productos a la lista de carritos
router.post("/:cid/product/:pid",routingError, addProductByCart);

//Eliminar producto del carrito);
router.get("/:cid/product/:pid", deleteProductByCart)

//actualiza arreglo products
router.put("/:cid", updatedCart);

//actualiza solo quantity products
router.put("/:cid/product/:pid", quantityProductByCart);

//Elimina todos los products del cart
router.get("/delete/:cid",deleteAllProductsByCart );

//Purchase 
router.post("/:cid/purchase",passportCall('jwt') ,purchaseCart)

export default router;

