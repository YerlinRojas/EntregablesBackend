import cartModel from "../dao/models/cart.model.js";

export const createCart = async (req, res) => {
  try {
    const cartList = new cartModel();
    await cartList.save();
    console.log({ cartList });

    res.send(cartList);
  } catch (error) {
    console.error("Error al enviar el producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await cartModel.find({ _id: cid }).explain("executionStats");

    //index para performance
    res.send(result);
    const populatedCart = await cartModel.findById(cid).populate("product.id");
    console.log(JSON.stringify(populatedCart, null, "\t"));
  } catch (error) {
    //console.error('Error al obtener producto por id:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cartList = async (req, res) => {
  try {
    const cartList = await cartModel.find();
    /* console.log({cartList})  */
    res.status(200).json(cartList);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    const updatedCart = await cartModel.updateOne(
      { _id: cid },
      { $push: { product: { id: pid, quantity } } }
    );
    const cart = await cartModel.findById(cid);

    const cartsave = await cart.save(updatedCart);

    console.log("CARRITO POR ID", cartsave);

    res.redirect("/products");
  } catch (error) {
    console.error("Error agregando producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartModel.findByIdAndUpdate(
      { _id: cid },
      { $pull: { product: { id: pid } } },
      { new: true }
    );
    cart.id = cid;

    console.log({ cart });
    res.redirect(`/${cid}`);
  } catch (error) {
    console.error("Error al borrar productos", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatedCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedFields = req.body;

    console.log(cid);
    console.log(updatedFields);

    const result = await cartModel.updateOne(cid, updatedFields);

    res.send(result);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const quantityProductByCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    const productIndex = cart.product.findIndex(
      (product) => product.id.toString() === pid
    );

    cart.product[productIndex].quantity = quantity;

    await cart.save();

    res.send(cart);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAllProductsByCart = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartModel.findById(cid);
    cart.product = [];
    await cart.save();

    res.send(cart);
  } catch (error) {
    console.error("Error al borrar productos", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
