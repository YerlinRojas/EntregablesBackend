
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.PERSISTENCE)

export default {

    PERSISTENCE: process.env.PERSISTENCE,

    PORT: process.env.PORT,
    URL: process.env.URL,
    dbName: process.env.dbName,
    ttl: process.env.ttl,
    secret: process.env.secret,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_callbackURL: process.env.GOOGLE_callbackURL,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_callbackurl: process.env.GITHUB_callbackurl,

    PRIVATE_KEY: process.env.PRIVATE_KEY,
    COOKIE_KEY: process.env.COOKIE_KEY,

    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    NODEMAILER_TYPE_SERVICE : process.env.NODEMAILER_TYPE_SERVICE
}





