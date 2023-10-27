import { productService, userService } from "../services/index.js";
import getMockingProducts from "./mocking.fn.js";
import { logger } from "../logger.js";

export const getList = async (req, res) => {
    try {
        const productsList = await productService.getList();
        logger.info("Desde el back:", { productsList });
        logger.http('Solicitud HTTP exitosa en /api/product/');
        res.send(productsList);
    } catch (error) {
        logger.error("Error obteniendo producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        
        const newProduct = req.body;
    logger.info("PARAMS FROM REQ, CREATE PRODUCT BACKEND", { newProduct });

    const newProductGenerated = await productService.createProduct(newProduct);

    logger.info("new product from BACKEND:", { newProductGenerated });
    logger.http('Solicitud HTTP exitosa en /api/product/create');
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
        logger.http('Solicitud HTTP exitosa en /api/product/delete/:pid');
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
        logger.http('Solicitud HTTP exitosa en /api/product/:pid');
        res.send(result);
    } catch (error) {
        logger.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const mockingProducts = async (req, res) => {
    try {
        const productos = await getMockingProducts(req, res);
        logger.http('Solicitud HTTP exitosa en /api/product/mockingProducts');
        return productos;
    } catch (error) {
        logger.error("error mocking", error);
        throw error;
    }
};
