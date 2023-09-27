import { productService } from "../services/index.js";
import getMockingProducts from "./mocking.fn.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";

export const getList = async (req, res) => {
    try {
        const productsList = await productService.getList();
        console.log("Desde el back:", { productsList });
        res.send(productsList);
    } catch (error) {
        console.error("Error obteniendo producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;

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

        console.log("params from REQ BODY:", { newProduct });
        const newProductGenerated = await productService.createProduct(newProduct);

        console.log("new product from BACKEND:", { newProductGenerated });
        res.send(newProductGenerated);
    } catch (error) {
        console.error("Error al enviar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.id;
        console.log("DELETE PRODUCT id:", pid);

        const deleteProduct = await productService.deleteProduct(pid);
        res.redirect("/home");
    } catch (error) {
        console.error("Error al borrar productos", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;

        console.log("UPDATE PRODUCT PID:", pid);
        console.log("UPDATE PRODUCT FIELDS:", updatedFields);

        const result = await productService.updateProduct(pid, updatedFields);

        res.send(result);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const mockingProducts = async (req, res) => {
    try {
        const productos = await getMockingProducts(req, res);
        return productos;
    } catch (error) {
        console.error("error mocking", error);
        throw error;
    }
};
