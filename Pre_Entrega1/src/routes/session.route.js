import { Router } from "express";
import { generateToken, passportCall, createHash } from "../utils.js";
import passport from "passport";
import config from "../config/config.js";
import { logger } from "../logger.js";
import CorreoController from "../controller/ticket.fn.js";
import {
  updateUserPassword,
  getUserFromToken,
  isValidPassword,
 
} from "../module/recoveryPass.js";
import { recoveryService, userService } from "../services/index.js";

const COOKIE_KEY = config.COOKIE_KEY;
const router = Router();
//---------------------------------------------------

router.get("/current", passportCall("jwt"), (req, res) => {
  console.log(req.user);
  res.render("profile", req.user);
});

//LOGIN JWT------------------------------
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const access_token = generateToken(req.user);

      res.cookie(COOKIE_KEY, access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      if (req.user && req.user.role === "admin") {
        // Si el usuario es administrador, redirigir a /home
        return res.redirect("/home");
      } else {
        // Si el usuario no es administrador, redirigir a /products
        return res.redirect("/products");
      }
    } catch (error) {
      logger.error("error al registrar", error);
      return res.redirect("/register");
    }
  }
);

// REGISTER JWT------------
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    try {
      const access_token = generateToken(req.user);

      res.cookie(COOKIE_KEY, access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      res.redirect("/login");
    } catch (error) {
      logger.error("error al registrar", error);
      return res.redirect("/register");
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie(COOKIE_KEY);
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error destroying session:", err);
    }
    res.redirect("/login");
  });
});

router.get("/solicitar-recuperacion-contrasena", async (req, res) => {
  res.render("recovery");
});

// Ruta para solicitar recuperación de contraseña
//ENVIAR SOLICITUD DESDE EL FORMULARIO
router.post("/enviar-correo-recuperacion", async (req, res) => {
  const { email } = req.body;
  const user = await userService.userByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "El correo no está registrado" });
  }
  const recoveryToken = generateToken();
  const recoveryLinkExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de expiración
  
  

    const newRecovery = {
      userId: user.id ,
      token:recoveryToken,
      expiration: recoveryLinkExpiration
    }

    const recovery = await recoveryService.createRecovery(newRecovery)
    console.log("Data recovery ", {recovery});

  //revisarlo
  const correoController = new CorreoController()
  const correoEnviado =
    await correoController.enviarCorreoRecuperacionContrasena(
      user,
      recoveryToken
    );
    console.log("este es el recovery token:", recoveryToken);

  if (correoEnviado) {
    res
      .status(200)
      .json({ message: "Correo de recuperación enviado con éxito" });
  } else {
    res
      .status(500)
      .json({ message: "Error al enviar el correo de recuperación" });
  }
});



router.get("/reset-password/:recoveryToken", async (req, res) => {
  const { recoveryToken } = req.params;
  const recovery = await recoveryService.findRecoveryByToken(recoveryToken);

  console.log("Este es el 2 paso token para new pass", {recoveryToken});

 if (recovery && recovery.expiration > new Date()) {
  // El token es válido y no ha expirado, muestra la página de restablecimiento de contraseña
  res.render('recoveryToken', {recoveryToken});
} else {
  logger.error("error token expirado", error);
    return res.send(error);;
}
});


// Ruta para procesar el formulario de restablecimiento de contraseña
//ERXTRAER DESDE EL FORMULARIO
router.post("/reset-password/:recoveryToken", async(req, res) => {
  try {
    //Problema cuando recupera de la URL :recoveryToken sale con ese mismo nombre
    //no ra el token sino, :recoveryToken
    const recoveryToken = req.params.recoveryToken;
    const { newPassword } = req.body;
    console.log("recoveryToken paso3", {recoveryToken});
    
    if (typeof recoveryToken !== 'string') {
      throw new Error("Token de recuperación no válido");
    }

    const recoveryRecord = await recoveryService.recoveryRecord(recoveryToken)
    const user = await userService.userById(recoveryRecord.userId)
    console.log("user desde recovery",{user});
    console.log("nueva contra",newPassword);
  
    const newPass = await userService.updatePass(user,newPassword)
  
    res.status(200).json({ message: "Contraseña actualizada con éxito" })

  } catch (error) {
    logger.error("error al cambiar contraseña", error);
    return res.send(error);
  }
  
});

export default router;
