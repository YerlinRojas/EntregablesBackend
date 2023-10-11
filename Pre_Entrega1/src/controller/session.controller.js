import { recoveryService, userService } from "../services/index.js";
import CorreoController from "./ticket.fn.js";
import { logger } from "../logger.js";

export const getNewPass = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.userByEmail(email);
        if (!user) {
          return res.status(404).json({ message: "El correo no está registrado" });
        }
        const recoveryToken = generateToken();
        logger.info("Generated token for password")
        const recoveryLinkExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de expiración
      
        //se almacena en la DB model recovery.model.js
        const newRecovery = {
          userId: user.id,
          token: recoveryToken,
          expiration: recoveryLinkExpiration,
        };
        const recovery = await recoveryService.createRecovery(newRecovery);

        const correoController = new CorreoController();
        const correoEnviado =
          await correoController.enviarCorreoRecuperacionContrasena(
            user,
            recoveryToken
          );
        if (correoEnviado) {
          res
            .status(200)
            .json({ message: "Correo de recuperación enviado con éxito, revisa tu casilla de Email" });
        } else {
          res
            .status(500)
            .json({ message: "Error al enviar el correo de recuperación" });
        }
    } catch (error) {
        logger.error("Error al generar nuevo password", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const recoveryToken = async (req, res) => {

    try {
          const { recoveryToken } = req.params;
  const recovery = await recoveryService.findRecoveryByToken(recoveryToken);

  if (recovery && recovery.expiration > new Date()) {
    logger.info ("Token valido dentro del tiempo de expiracion")
    // El token es válido y no ha expirado, muestra la página de restablecimiento de contraseña
    res.render("recoveryToken", { recoveryToken });
  } else {
    logger.error("error token expirado", error);
    return res.send(error);
  }
    } catch (error) {
        logger.error("Error al recuperar el token:", error);
        res.status(500).json({ error: "Internal server error" });
    }

};



export const newPassword = async (req, res) => {
  try {
    const recoveryToken = req.params.recoveryToken;
    logger.info("Se obtiene el token del req")
    const { newPassword } = req.body;
    const recoveryRecord = await recoveryService.findRecoveryByToken(recoveryToken);

    const user = await userService.userById(recoveryRecord.userId);

    const newPass = await userService.updatedPass(user._id, newPassword);
    logger.info("Contraseña se actualiza con exito")
    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    logger.error("Error al actualizar contraseña", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
