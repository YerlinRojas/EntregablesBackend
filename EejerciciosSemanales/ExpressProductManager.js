/* Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
Aspectos a incluir

Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
El servidor debe contar con los siguientes endpoints:
ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
Si no se recibe query de límite, se devolverán todos los productos
Si se recibe un límite, sólo devolver el número de productos solicitados
ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 
Sugerencias
Tu clase lee archivos con promesas. recuerda usar async/await en tus endpoints
Utiliza un archivo que ya tenga productos, pues el desafío sólo es para gets. 
Formato del entregable
Link al repositorio de Github con el proyecto completo, el cual debe incluir:
carpeta src con app.js dentro y tu ProductManager dentro.
package.json con la info del proyecto.
NO INCLUIR LOS node_modules generados.
___________________________________
Se instalarán las dependencias a partir del comando npm install
Se echará a andar el servidor
Se revisará que el archivo YA CUENTE CON AL MENOS DIEZ PRODUCTOS CREADOS al momento de su entrega, es importante para que los tutores no tengan que crear los productos por sí mismos, y así agilizar el proceso de tu evaluación.
Se corroborará que el servidor esté corriendo en el puerto 8080.
Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.
Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.
Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.
 */

//---------Ya esta instalado el nodemon solo inicializar 
//configuraciones de entorno

import express from 'express'
const app = express ()
app.use(express.json())

const products= [

  {
    id: 1,
    title: "prod1",
    stock:2
  },
  {
    id: 2,
    title: "prod2",
    stock:8
  },
  {
    id: 3,
    title: "prod3",
    stock:5
  },
  {
    id:4,
    title: "prod4",
    stock:2
  },
  {
    id: 5,
    title: "prod5",
    stock:2
  },
  {
    id: 6,
    title: "prod6",
    stock:2
  },
  {
    id: 7,
    title: "prod7",
    stock:2
  },
  {
    id: 8,
    title: "prod8",
    stock:2
  },
  {
    id: 9,
    title: "prod9",
    stock:2
  },
  {
    id: 10,
    title: "prod10",
    stock:2
  }
]


//get products to limit or all
app.get('/api/products' , async(req,res)=>{
  try {
    const limit = parseInt(req.query.limit)

    if (limit && limit > 0) {
      const limitProduct = products.slice(0, limit)
      res.json(limitProduct)
    } else {
     res.json(products)
    }

  } catch (error) {
    res.status(500).json({status:'error', message: 'server error'})
  }
})

//get products to id. not found

app.get('/api/products/:pid', async(req,res)=>{
  try {
    
    const pid = parseInt(req.params.pid)
    const productIndex = products.find(p => p.id === pid)
    if (productIndex)  {
      res.json(productIndex)
    } else {
      res.status(404).json({status: 'error', message:'ID invalid'})
    }

  } catch (error) {
    res.status(404).json({status:'error', message:'product not found'})
  }
})



app.listen(8080, () => {
  console.log("Server runing on port 8080")
  })



