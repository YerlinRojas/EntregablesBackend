import { productService, cartService, userService } from '../services/index.js'

import nodemailer from 'nodemailer'
import config from '../config/config.js';
import __dirname from '../utils.js';

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

    //console.log("productByCard, desde view.controller", paginatedProducts);
    //console.log("user, desde view.controller", user);
    //-----------------------------------------------------------
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
    console.log('params from REQ BODY:', { newProduct })

    //se importa por user services
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

    //ERROR
    //duplica pq no guarda el nuevo cart para agregar nuevos prod
    res.redirect(`/cart/${cid}`); 
   
    // Guarda el carrito actualizado en la base de datos
    //await cart.save();
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

     // Check if the cart exists
     if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.product.findIndex((product) => product.id === pid);

    console.log("product.id?", product.id)
    // Si el producto no se encuentra en el carrito, devuelve un error
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    // Elimina el producto del carrito
    cart.product.splice(productIndex, 1);

    console.log("Producto eliminado con cid:", cid, "y pid:", pid);


     res.redirect(`/${cid}`);
  } catch (error) {
    console.error("Error to delete products at cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.NODEMAILER_USER,
    pass: config.NODEMAILER_PASS
  }
})

//se puede adjuntar los datos del tikect??????????
//o desde purchase Cart... 
//en purchase cart Tengo los productos resultado del stok 

export const mailer = async (req, res) => {

  try {
    //INTENTE OBTENER LOS DATOS DEL USUARIO DESDE EL JWT 
    //const user = req.user
    //console.log("user mailer",user);
    // const getUser = await userService.getUser({ user.email })
    // console.log("ESTE ES EL EMAIL DEL USER PARA Mailer",getUser.email)

    //probar esta logica..-..
    const result = await transport.sendMail({
      from: config.NODEMAILER_USER,
      to: 'yerlinrojas808@gmail.com',
      subject: 'Gracias por tu compra!!',
      html: `
          <div>
              Gracias por tu compra
  
              <img src="cid:logoCorp" />
          </div>
      `, attachments: [
        {
          filename: 'logo.jpg',
          path: `${__dirname}/public/logo.jpg`,
          cid: 'logoCorp'
        }
      ]

    })
    console.log(result)
    res.send('Email sent')
  } catch (error) {
    console.error('error sending mailer', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}