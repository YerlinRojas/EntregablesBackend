
import { logger } from "../logger.js";
import { productService } from "../services/index.js";
import mongoose from 'mongoose'

export async function productBelongsToUser(pid, user) {
  
  console.log("productID",pid);//OK
    try {
    console.log("userRQE", user);

    const userId = new mongoose.Types.ObjectId(user);
    const product = await productService.productByOwner(pid,userId);

      return !!product;
    } catch (error) {
   
      logger.error('Error al verificar si el producto pertenece al usuario:', error);
      return false; 
    }
  } 
  

  
  