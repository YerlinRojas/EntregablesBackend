import {
  cartService,
  productService,
  ticketService,
} from "../services/index.js";
import { v4 as uuidv4 } from "uuid";
import CorreoController from "./ticket.fn.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { logger } from "../logger.js";

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();

    logger.info("Cart from createCart: ", { cart });
    logger.http('Solicitud HTTP exitosa en /api/cart/');

    res.send(cart);
  } catch (error) {
    logger.error("Error to create cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await cartService.cartById(cid);

    if (!result) {
      CustomError.createError({
        name: "Cart not found error",
        cause: generateCartErrorInfo(result),
        message: "Error trying to create product",
        code: EErrors.CART_NOT_FOUND_ERROR,
      });
    }
    const populatedCart = await cartModel.findById(cid).populate("product.id");

    logger.info(
      "Populate from cartById BACKEND: ",
      JSON.stringify(populatedCart, null, "\t")
    );
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid');
    res.send(result);
  } catch (error) {
    logger.error("Error to get cartId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cartList = async (req, res) => {
  try {
    const cartList = await cartService.cartList();
    logger.info("cartList from CartList BACKEND: ", { cartList });
    logger.http('Solicitud HTTP exitosa en /api/cart/');

    res.status(200).json(cartList);
  } catch (error) {
    logger.error("Error to get cartList:", error);
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
      CustomError.createError({
        name: "Cart not found error",
        cause: generateCartErrorInfo(cart),
        message: "Error trying to create product",
        code: EErrors.CART_NOT_FOUND_ERROR,
      });
    }
    const addProductByCart = await cartService.addProductByCart(
      cid,
      pid,
      quantity
    );
    logger.info("AddPorductByCart :", addProductByCart);
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid/product/:pid');


    res.send(addProductByCart);
  } catch (error) {
    logger.error("Error to add product at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartService.deleteProductByCart(cid, pid);
    cart.id = cid;

    logger.info("delete Product by Cart :", { cart });
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid/product/:pid');

    res.send(cart);
  } catch (error) {
    logger.error("Error to delete products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatedCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedFields = req.body;

    const result = await cartService.updatedCart(cid, updatedFields);
    logger.info("update Cart:", result);
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid');
    
    res.send(result);
  } catch (error) {
    logger.error("Error to update cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const quantityProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body;

    const cart = await cartService.quantityProductByCart(cid, pid, quantity);
    logger.log("Quantity products by cart:", cart);
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid/product/:pid');

    res.send(cart);
  } catch (error) {
    console.error("Error to quantityProducts at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAllProductsByCart = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartService.deleteAllProductsByCart(cid);
    logger.info("delete all products by cart:", { cart });
    logger.http('Solicitud HTTP exitosa en /api/cart/delete/:cid');


    res.send(cart);
  } catch (error) {
    logger.error("Error to delete all products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.cartById(cid);
    const user = req.user.user;
    //esta ok el user.email
    logger.info("User EMAIL for Purchase", user.email);

    if (!cart) {
      CustomError.createError({
        name: "Cart not found error",
        cause: generateCartErrorInfo(cart),
        message: "Error trying to create product",
        code: EErrors.CART_NOT_FOUND_ERROR,
      });
    }

    //genero dos arrays para products comprados y no
    const purchasedProducts = [];
    const outOfStockProducts = [];

    let amount = 0;
    // Verificar el stock de cada producto en el carrito
    for (const cartItem of cart.product) {
      const product = await productService.productById(cartItem.id._id);

      logger.info("stock de product en cart", product.stock);
      logger.info("cart item quantity", cartItem.quantity);
      logger.info("Objet de cada product en el cart", cartItem.id);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found for ID ${cartItem.id}` });
      }

      if (cartItem.quantity < product.stock) {
        purchasedProducts.push({
          product: product,
          quantity: cartItem.quantity,
        });

        product.stock -= cartItem.quantity;
        amount += product.price * cartItem.quantity;

        logger.info(
          "Updated stock for product:",
          product.stock
        );

        await product.save();
      } else {
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
    logger.info(
      "New cart after verification Stock",
      updatedCart
    );
    const code = uuidv4();
    const ticketData = {
      code: code,
      amount: amount,
      purchaser: user.email,
    };

    const ticket = await ticketService.createTicket(ticketData);

    const ticketJSON = JSON.stringify(ticket);

    const correoController = new CorreoController();
    await correoController.enviarCorreo(user, ticketJSON);
    logger.http('Solicitud HTTP exitosa en /api/cart/:cid/purchase');
    
    res.status(200).json({
      message: "Purchase completed successfully",
      purchasedProducts: purchasedProducts,
      outOfStockProducts: outOfStockProducts,
      ticket: ticket,
    });
  } catch (error) {
    logger.error("Error completing purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
