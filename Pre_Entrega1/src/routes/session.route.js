import { Router } from "express";
import { generateToken, passportCall} from "../utils.js";
import passport from "passport";
import config from "../config/config.js";
import { logger } from "../logger.js";

import { getNewPass, newPassword, recoveryToken } from "../controller/session.controller.js";

const COOKIE_KEY = config.COOKIE_KEY;
const router = Router();


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


//PASO1
router.post("/enviar-correo-recuperacion", getNewPass);

//PASO2 recupera el token del mail
router.get("/reset-password/:recoveryToken", recoveryToken);

//ACTUALIZA CONTRASEÑA
router.post("/reset-password/:recoveryToken", newPassword)
export default router;
