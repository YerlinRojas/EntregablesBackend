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
    }}

