import express from 'express'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import viewsRouter from './routes/views.route.js'
import chatRouter from './routes/chat.route.js'

import config from './config/config.js'

import sessionRouter from './routes/session.route.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'

import __dirname from './utils.js'



//config express
const app = express ()
app.use(express.json())
//cuando pasamos info por la url
app.use(express.urlencoded({extended:true}))

//config handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//config public static
app.use('/public', express.static(__dirname + '/public'))

//conexion mongoose seteo
//esto se fue a config mongo


//cookie parser
app.use(cookieParser())

// Configuración de express-session
//se cambian url y dbname importada de dotevn
app.use(session({
  store: MongoStore.create({
      mongoUrl:config.URL,
      dbName: config.dbName,
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      },
      ttl: config.ttl,
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))


// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//routes 
app.use('/api/session', sessionRouter) 
app.use('/', viewsRouter) //Index
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)


//PORT se importa desde configMongo.js
app.listen(config.PORT, () => console.log('Listening...'))



//connect mongo DB por factory.js





















