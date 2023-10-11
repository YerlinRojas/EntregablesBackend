import {fileURLToPath} from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import config from './config/config.js'
import { logger } from './logger.js'
import { productService } from './services/index.js'

const PRIVATE_KEY = config.PRIVATE_KEY
const COOKIE_KEY = config.COOKIE_KEY

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
        if(user.user.role != role) return res.status(403).send({error: 'No permission'})
        logger.info(user.user.role)
        return next()
    }
} 

/* export const authorization = (role) => {
    return async (req, res, next) => {
        const user = req.user;

        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        if (user.role === 'admin') {
            // Si el usuario es un administrador, tiene permisos completos
            return next();
        } else if (user.role === 'premium') {
            // Si el usuario es premium
            if (req.method === 'DELETE' && req.params.pid) {
                // Si es una solicitud de eliminación (DELETE) y se proporciona un productId en los parámetros
                const product = await productService.productById(req.params.pid);

                if (!product) {
                    return res.status(404).send({ error: 'Product not found' });
                }

                if (product.owner.toString() === user._id.toString()) {
                    // El usuario premium solo puede eliminar productos que le pertenecen
                    return next();
                } else {
                    return res.status(403).send({ error: 'No permission' });
                }
            }
        }

        return res.status(403).send({ error: 'No permission' });
    };
}; */

export default __dirname