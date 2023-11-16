import { Router } from "express";
import {getUsers } from '../controller/user.controller.js'
import { upload } from "../utils.js";
import circularReplacer from "../module/circular.js";
import { logger } from "../logger.js";

const router = Router()

router.post('/premium/:userId', getUsers)

/* router.post("/:uid/documents/profile", uploadProfile.single("profile"), async (req, res) => {
  try {
    const userId = req.params.uid;
    const documentType = req.body.documentType;
    const documentos = req.files;

    logger.http("Solicitud HTTP exitosa en /api/user/:uid/documents/profile");
    res.status(200).json({
      message: "Archivo subido exitosamente",
      userId,
      documentType,
      documentos,
    });

  } catch (error) {
    logger.error("error al subir archivo")
    res.status(500).json({
      error: "Error interno del servidor",
      circularError: JSON.stringify(error, circularReplacer()),
    });
  }
}); */

/* router.post("/:uid/documents", upload.array("documents"), async (req, res) => {
  try {
    const userId = req.params.uid;
    const documentType = req.body.documentType;
    const documentos = req.files;

    logger.http("Solicitud HTTP exitosa en /api/user/:uid/documents");
    res.status(200).json({
      message: "Archivos subidos exitosamente",
      userId,
      documentType,
      documentos,
    });

  } catch (error) {
    logger.error("error al subir archivos")
    res.status(500).json({
      error: "Error interno del servidor",
      circularError: JSON.stringify(error, circularReplacer()),
    });
  }
}); */


router.post("/:uid/documents", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error al subir archivos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    const userId = req.params.uid;
    const documentType = req.body.documentType;
    const documentos = req.files;

    logger.http("Solicitud HTTP exitosa en /api/user/:uid/documents");
    res.status(200).json({
      message: "Archivos subidos exitosamente",
      userId,
      documentType,
      documentos,
    });
  });
});
export default router