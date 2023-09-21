
import config from "./config.js"
import nodemailer from 'nodemailer'



export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.NODEMAILER_USER,
        pass: config.NODEMAILER_PASS
    }
  })