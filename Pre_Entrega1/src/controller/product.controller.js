import { productService, userService } from "../services/index.js";
import getMockingProducts from "./mocking.fn.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { logger } from "../logger.js";

export const getList = async (req, res) => {
    try {
        const productsList = await productService.getList();
        logger.info("Desde el back:", { productsList });
        logger.http('Solicitud HTTP exitosa en /api/cart/');
        res.send(productsList);
    } catch (error) {
        logger.error("Error obteniendo producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const userId = req.user.user;
        if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.category ||
            !newProduct.thumbnail ||
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

        logger.info("PARAMS FROM REQ, CREATE PRODUCT BACKEND", { newProduct });

        const user = await userService.findOne(userId);

        if (!user) {
            logger.error("OWNER FOR PRODUCT NO FIND");
        }

        
        newProduct.owner = user._id;
        console.log("este usuario creo el product", user._id);
        const newProductGenerated = await productService.createProduct(newProduct);

        logger.info("new product from BACKEND:", { newProductGenerated });
        logger.http('Solicitud HTTP exitosa en /api/cart/create');
        res.send(newProductGenerated);
    } catch (error) {
        logger.error("Error al enviar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        logger.info("Product by ID:", pid);
        const deleteProduct = await productService.deleteProduct(pid);
        logger.http('Solicitud HTTP exitosa en /api/cart/delete/:pid');
        res.send(deleteProduct);
    } catch (error) {
        logger.error("Error al borrar productos", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;

        logger.info("UPDATE PRODUCT PID:", pid);
        logger.info("UPDATE PRODUCT FIELDS:", updatedFields);

        const result = await productService.updateProduct(pid, updatedFields);
        logger.http('Solicitud HTTP exitosa en /api/cart/:pid');
        res.send(result);
    } catch (error) {
        logger.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const mockingProducts = async (req, res) => {
    try {
        const productos = await getMockingProducts(req, res);
        logger.http('Solicitud HTTP exitosa en /api/cart/mockingProducts');
        return productos;
    } catch (error) {
        logger.error("error mocking", error);
        throw error;
    }
};
