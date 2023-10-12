import { productBelongsToUser } from "../module/productBelongsToUser.js";


export const authorizeDelete = role =>{
    return async (req, res, next) => {

    const user = req.user.user; 
    const pid = req.params.pid; 

    //const userId = user._id

    console.log("user desde authorizeDelete ", user);//ok
    //console.log("userID desde authorizeDelete ", userId);//ok
    

    if (user.role === "admin") {
        console.log("user role admin middleware " );
      return next(); // El administrador puede borrar cualquier producto
    }
  
    
    if (user.role === "premium") {
        const productBelongs = await productBelongsToUser(pid, user._id);

        if (productBelongs) {
          return next(); // El usuario premium puede borrar sus propios productos
        }else{
          console.log("El producto no le pertenece al usuario");
        }
      }
  
    // Si no se cumple ninguna de las condiciones anteriores, el usuario no tiene permiso
    return res.status(403).json({ error: "No permission" });
  };}