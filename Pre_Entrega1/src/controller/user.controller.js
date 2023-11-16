import { userService } from '../services/index.js'
import { logger } from '../logger.js'


export const getUsers = async(req,res)=> {
try {
    const userId = req.params.userId;
    const newRole = req.body.newRole
     logger.info("userId user controller", userId);
    if (!['user', 'premium'].includes(newRole)) {
        throw new Error('Rol no válido');
      }
    const updateRole = await userService.newRole(userId, newRole)
    logger.http("Solicitud HTTP exitosa en api/user/premium/:userId");
    res.redirect("/userRole");

    
} catch (error) {
    logger.error("error al cambiar rol de usuario")
    res.status(500).json({ error: "Internal server error" });
}
}