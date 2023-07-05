import express from 'express'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'

const app = express ()
app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

  app.listen(8080, () => {
    console.log("Server runing on port 8080")
    })
  




























