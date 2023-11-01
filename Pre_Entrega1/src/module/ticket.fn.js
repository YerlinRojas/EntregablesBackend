import config from "../config/config.js";
import nodemailer from 'nodemailer'

export default class CorreoController {

    constructor() {
      this.transporter = nodemailer.createTransport({
        service: config.NODEMAILER_TYPE_SERVICE,
        port: 587,
        auth: {
          user: config.NODEMAILER_USER,
          pass: config.NODEMAILER_PASS
        }
      });
    }
   async enviarCorreo(user, ticketJSON) {
      const mailOptions = {
        from: config.NODEMAILER_USER,
        to: user.email,
        subject: "GRACIAS POR TU COMPRA",
        text: ticketJSON,
      };
  
      try {
        await this.transporter.sendMail(mailOptions)
        return true;
      } catch (error) {
        console.log("error", error);
        return false;

      }
    }

    async enviarCorreoRecuperacionContrasena(user, recoveryToken) {
      const recoveryLink = `http://127.0.0.1:8080/api/session/reset-password/${recoveryToken}`;
      const mailOptions = {
          from: config.NODEMAILER_USER,
          to: user.email,
          subject: "Recuperación de Contraseña",
          html: `
              <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
              <a href="${recoveryLink}">Restablecer Contraseña</a>
          `,
      };

      try {
          await this.transporter.sendMail(mailOptions);
          return true;
      } catch (error) {
          console.log("Error al enviar el correo de recuperación de contraseña", error);
          return false;
      }
  }
  }

