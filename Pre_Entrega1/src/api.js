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

import ProductFile from "./dao/manager/product.file.js"
import http from "http";
import { Server } from 'socket.io'
const productFile = new ProductFile ()

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

//routes 
app.use('/api/session', sessionRouter) 
app.use('/', viewsRouter) //Index
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)

// Create an HTTP server using Express
const server = http.createServer(app);

// Start listening on the server
server.listen(config.PORT, () => {
  console.log('Listening...');

  // Configure Socket.io logic here
  const io = new Server(server); // Create a Socket.io instance and attach it to the HTTP server
  const messages = [];

  //socket logic
  io.on("connection", (socket) => {
    socket.on("new", (user) =>
      console.log(`${user} se acaba de conectar`)
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
      console.log(get);
      io.emit("productDeleted", get);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});

/* 
server.listen(config.PORT,
() => {console.log('Listening...')
 //configuracion socket io
              const httpServer = http.createServer(app);
             const io = new Server(httpServer);
             const messages = [];
            //socket-------------
             io.on("connection", (socket) => {
                socket.on("new", (user) =>
                    console.log(`${user} se acaba de conectar`)
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
                    console.log(get);
                    io.emit("productDeleted", get);
                });

                socket.on("disconnect", () => {
                    console.log("Client disconnected");
                });

})
 */