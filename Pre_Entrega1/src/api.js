import express from 'express'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import viewsRouter from './routes/views.route.js'
import ProductManager from './dao/manager/product.manager.js'

import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'

//config express
const app = express ()
app.use(express.json())
//cuando pasamos info por la url
app.use(express.urlencoded({extended:true}))

//routes
app.use('/', viewsRouter)
app.use('/home', productRouter)
app.use('/realtimeproducts', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


//config handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//config public static
app.use('/public', express.static(__dirname + '/public'))

//conexion mongoose
mongoose.set('strictQuery', false)
const URL = 'mongodb+srv://yerlinrocha:Skabiosis2@cluster0.scftdt5.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(URL,{
  dbName: 'ecommerce'
})
  .then(() => {
      console.log('DB connected!!')
      
      // Corremos el server
      const server = app.listen(8080, () => console.log('Listening...'))
      server.on('error', e => console.error(e))
  })
  .catch(e => {
      console.log("Can't connect to DB")
  })

















  
//congi socket io
/* 
const PORT = process.env.PORT || 8080
const httpServer = app.listen(PORT, () => console.log("Listening...")) */
/* const io = new Server(httpServer) */
/* 
const productManager = new ProductManager()

io.on('connection', (socket) => {
    console.log('New client connected')

    //Agrega porducto por el productManager import
    socket.on('addProduct', async(data) => {
      await productManager.addProduct(data);
      const get = await productManager.getProduct()
      io.emit('productAdded', get)
    })

    //Delete product
    socket.on('deleteProduct', async(id)=>{
      await productManager.deleteProduct(id)
      const get = await productManager.getProduct()
      console.log(get)
      io.emit('productDeleted', get)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })

  }); */
























