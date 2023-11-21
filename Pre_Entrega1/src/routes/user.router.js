import { Router } from "express";
import {getUsers } from '../controller/user.controller.js'
import { upload } from "../utils.js";
import { logger } from "../logger.js";
import { userService } from "../services/index.js";



const router = Router()


  router.post('/premium/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const newRole = req.body.newRole;

        logger.info("userId user controller", userId);

        if (!['user', 'premium'].includes(newRole)) {
            throw new Error('Rol no válido');
        }

        // Check if the user has documents
        const user = await userService.userById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.documents.length > 0) {
            // Update the user's role only if they have documents
            const updateRole = await userService.newRole(userId, newRole);
            logger.http("Solicitud HTTP exitosa en api/user/premium/:userId");
            res.redirect("/userRole");
        } else {
            res.status(400).json({ error: "El usuario no tiene documentacion necesaria para cambiar de rol" });
        }

    } catch (error) {
        logger.error("error al cambiar rol de usuario");
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/:uid/documents", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir archivos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    const userId = req.params.uid;
    const documentType = req.body.documentType;
    const documents = req.files;
    console.log('userId',userId,'documentType', documentType,'documentos', documents);
    
    
    try { 
      // Actualizar el usuario para incluir la información del nuevo documento
      const uploadFiles = await userService.findByIdAndUpdate(
        userId,documents
        );
        
        const user = await userService.userById(userId)
        console.log(user)

      logger.http("Solicitud HTTP exitosa en /api/user/:uid/documents");
      res.redirect("/api/session/current")
    } catch (error) {
      console.error("Error al guardar documentos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
});


export default router