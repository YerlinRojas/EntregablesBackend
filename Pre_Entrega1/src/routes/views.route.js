//contiene renderizaciones

import { Router } from "express";
import ProductManager from "../dao/manager/product.manager.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.model.js";

const router = Router();
const productManager = new ProductManager();

router.get("/index", (req, res) => {
    res.render("index", {});
});


//rutas para users 
//login
router.get('/', (req, res) => {
    //si esta logeado entra al los products
    if(req.session?.user) {
        res.redirect('/products')
    }
    res.render('login', {})
})


//registrase
router.get('/register', (req, res) => {
    if(req.session?.user) {
        res.redirect('/products')
    }

    res.render('register', {})
})

//esta autorizacion es para saber si el user esta
//logeado pasa
//sino esta registrado manda al login
function auth(req, res, next) {
    if(req.session?.user) return next()
    res.redirect('/')
}


//esta ruta renderiza products en cards
router.get('/products',auth, async (req, res) => {
    try {
        //parametros de user
        const user = req.session.user

        //----------------------------------------------------------------
        //opciones de filtrado
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);

        const sortOrder = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
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

        productsList.prevLink = productsList.hasPrevPage? `/products?page=${productsList.prevPage}&limit=${limit}`: "";
        productsList.nextLink = productsList.hasNextPage? `/products?page=${productsList.nextPage}&limit=${limit}`: "";
        //-------------------------------------------------------------
        const cartListAll = await cartModel.find()
        let cartId

        if(cartListAll.length > 0){
            cartId = cartListAll[0]._id
        }else{
        const cartList = new cartModel();
        const cart = await cartList.save();
        cartId = cart._id;
        console.log(cartId) 
        }

        res.render("products", { products: productsList, cartId, user })
        

    

    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//esta ruta renderiza
router.get("/home", async (req, res) => {
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

//esta ruta renderiza
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProduct();
        res.render("realtimeproducts", { products });
    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Vista del carrito específico
router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartModel.findById(cartId).lean().exec();

        if (!cart) {
            return res.status(404).json({ error: 'Cart no encontrado' });
        }


        res.render('carts', { cart });
    } catch (error) {
        console.error('Error obteniendo el carrito por id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;
