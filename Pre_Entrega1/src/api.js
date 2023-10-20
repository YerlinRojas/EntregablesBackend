import express from 'express'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import viewsRouter from './routes/views.route.js'
import chatRouter from './routes/chat.route.js'
import userRouter from './routes/user.router.js'

import config from './config/config.js'

import sessionRouter from './routes/session.route.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'

import __dirname from './utils.js'

//swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express' 

//cluster
import cluster from 'cluster'
import { cpus } from 'os'

//socket io
import ProductFile from "./dao/manager/product.file.js"
import http from "http";
import { Server } from 'socket.io'
import { logger } from './logger.js'
const productFile = new ProductFile ()

//cluster
//numeros de cpus
const numCPUs = cpus().length;

if (cluster.isPrimary && config.NODE_ENV === 'production') {

  //si estamos en el  primario(master) y entorno de production se crean hijos (workers)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
    //cada fork es un proceso pid
  }
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Proceso hijo ${worker.process.pid} finalizado`);
  });

}else{

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
  
  
  //cookie parser
  app.use(cookieParser())
  
  // Configuración de express-session
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
  
  //Swagger options
  const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Docs e-commerce',
            description: 'e-commerce Proyect s '
        }
    },
    apis: [
      `${__dirname}/docs/**/*.yaml`
  ]
}

  const specs = swaggerJSDoc(swaggerOptions)
//routes 
  app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
  app.use('/api/session', sessionRouter) 
  app.use('/', viewsRouter) //Index
  app.use('/api/products', productRouter)
  app.use('/api/carts', cartRouter)
  app.use('/api/chat', chatRouter)
  app.use('/api/user', userRouter)
  

  // Create an HTTP server using Express
  const server = http.createServer(app);
  
  // Start listening on the server
  server.listen(config.PORT, () => {
    logger.debug('Servidor iniciado con éxito', { port: config.PORT, environment: config.NODE_ENV });
  
    const io = new Server(server); 
    const messages = [];
  
    //socket logic
    io.on("connection", (socket) => {
      socket.on("new", (user) =>
        logger.info(`${user} se acaba de conectar`)
      );
  
      //chat
      socket.on("message", (data) => {
        messages.push(data);
        io.emit("logs", messages);
      });
  
      //Agrega producto por el productManager import
      socket.on("addProduct", async (data) => {
        await productFile.create(data);
        const get = await productFile.getList();
        io.emit("productAdded", get);
      });
  
      //Delete product
      socket.on("deleteProduct", async (id) => {
        await productFile.deleteProduct(id);
        const get = await productFile.getList();
        logger.info("Lista de Productos");
        io.emit("productDeleted", get);
      });
  
      socket.on("disconnect", () => {
        logger.info("Client disconnected");
      });
    });
  });
}
