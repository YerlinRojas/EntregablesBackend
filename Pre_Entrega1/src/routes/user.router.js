import { Router } from "express";
import {getUsers } from '../controller/user.controller.js'
import { upload } from "../utils.js";
import { logger } from "../logger.js";
import { userService } from "../services/index.js";



const router = Router()

router.post('/premium/:userId', async(req,res)=> {
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
  })


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
    
   // const originalName = documents.documents.originalname;
    //console.log(originalName); //OK

    
    try { 
      // Actualizar el usuario para incluir la información del nuevo documento
      const uploadFiles = await userService.findByIdAndUpdate(
        userId,documents
        );
        
        const user = await userService.userById(userId)
        console.log(user)

      logger.http("Solicitud HTTP exitosa en /api/user/:uid/documents");
      res.status(200).json({
        message: "Archivos subidos exitosamente",
        userId,
        documentType,
        documents,
      });
    } catch (error) {
      console.error("Error al guardar documentos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
});


export default router