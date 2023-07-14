import express from 'express'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import viewsRouter from './routes/views.route.js'
import ProductManager from './manager/product.manager.js'

import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'

//config express
const app = express ()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//routes
app.use('/', viewsRouter)
app.use('/home', viewsRouter)
app.use('/realtimeproducts', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


//config handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//config public static
app.use('/static', express.static(__dirname + '/public'))

//congi socket io
const PORT = process.env.PORT || 8080
const httpServer = app.listen(PORT, () => console.log("Listening..."))
const io = new Server(httpServer)

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

  });
























