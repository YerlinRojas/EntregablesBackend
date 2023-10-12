
import { logger } from "../logger.js";
import { productService } from "../services/index.js";
import mongoose from 'mongoose'

export async function productBelongsToUser(pid, user) {
  
  console.log("productID",pid);//OK
    try {
    console.log("userRQE", user);

    const userId = new mongoose.Types.ObjectId(user);

      // Busca el producto en la base de datos utilizando el ID y el ID del usuario
      const product = await productService.productByOwner(pid,userId);

      console.log("product to owner", product);
      logger.info("producto le pertenece al owner")

      return !!product;
    } catch (error) {
   
      logger.error('Error al verificar si el producto pertenece al usuario:', error);
      return false; 
    }
  } 
  

  
  