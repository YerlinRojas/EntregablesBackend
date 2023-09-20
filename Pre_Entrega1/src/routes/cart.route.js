import { Router } from "express";
import{ deleteAllProductsByCart, addProductByCart, /* cartById, */ cartList, createCart, deleteProductByCart, quantityProductByCart, updatedCart, } from '../controller/cart.controller.js'

const router = Router();

//crear carrito
router.post("/", createCart);

//CART POR ID
//router.get("/:cid", cartById);

//LISTADO cart
router.get("/", cartList);

//agrega productos a la lista de carritos
router.post("/:cid/product/:pid", addProductByCart);

//Eliminar producto del carrito);
router.get("/:cid/product/:pid", deleteProductByCart)

//actualiza arreglo products
router.put("/:cid", updatedCart);

//actualiza solo quantity products
router.put("/:cid/product/:pid", quantityProductByCart);

//Elimina todos los products del cart
router.get("/delete/:cid",deleteAllProductsByCart );

export default router;

