import { userService } from '../services/index.js'
import { logger } from '../logger.js'
import { message } from './chat.controller.js';

export const getUsers = async(req,res)=> {
try {
    const userId = req.params.userId;
    const newRole = req.body.newRole
     console.log("userId user controller", userId);
    if (!['user', 'premium'].includes(newRole)) {
        throw new Error('Rol no válido');
      }

    const updateRole = await userService.newRole(userId, newRole)

    res.redirect("/userRole");

    
} catch (error) {
    logger.error("error al cambiar rol de usuario")
    res.status(500).json({ error: "Internal server error" });
}
}