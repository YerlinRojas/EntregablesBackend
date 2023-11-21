import {fileURLToPath} from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import multer from 'multer'
import  path from 'path'
import fs from 'fs'

import config from './config/config.js'
import { logger } from './logger.js'


const PRIVATE_KEY = config.PRIVATE_KEY
const COOKIE_KEY = config.COOKIE_KEY


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const { documentType, profileType, productType } = req.body;

      let folder;
      if (file?.fieldname === "profile") {
          folder = "profiles";
      } else if (file?.fieldname === "product") {
          folder = "products";
      } else if (file?.fieldname === "document") {
          folder = "documents";
      } else {
          return cb(new Error("Tipo de documento no válido"));
      }
      const destinationFolder = path.join(__dirname, `../uploads/${folder}`);
      // Verificar si el directorio existe, y si no, crearlo
      fs.mkdirSync(destinationFolder, { recursive: true });
      cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
      const userId = req.params.uid;
      cb(null, `${userId}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage: storage }).fields([
  { name: 'profile', maxCount: 1 },
  { name: 'document', maxCount: 10 },
]);

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) 
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password) // true o false
}

// JWT Generamos el token
export const generateToken = (user) => {
    const token = jwt.sign( {user}, PRIVATE_KEY, {expiresIn: '24h'})
    logger.info("GenerateToken")
    return token
}

//extraer cookies
export const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies[COOKIE_KEY] : null

    logger.info('COOKIE EXTRACTOR: ', token)
    return token
}


// JWT Extraemos el token del header
export const authToken = (req, res, next) => {

    // Buscamos el token en el header o en la cookie
    let authHeader = req.headers.auth
    if(!authHeader) {
      authHeader = req.cookies[COOKIE_KEY] 
      if(!authHeader) {
        return res.status(401).send({
            error: 'Not auth'
        })
      }
    }

    // Verificamos y desencriptamos la informacion 
    const token = authHeader
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authroized'})

        req.user = credentials.user
        next()
    })
}

export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if(err) return next(err)
            if(!user) {
                return res.status(401).send(
                logger.error({error: info.messages? info.messages : info.toString()}) 
                )
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = role => {

    return async(req, res, next) => {
        const user = req.user

        if(!user) return res.status(401).send({error: 'Unauthorized'})

        if (!role.includes(user.user.role)) {
            return res.status(403).send({ error: 'No permission' });
        }

        logger.info(user.user.role)
        return next()
    }
} 

export default __dirname