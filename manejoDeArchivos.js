/* Se creará una instancia de la clase “ProductManager”
Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25
El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
 */

const fs = require ('fs')

class ProductManager {
    //1
    constructor (path){
        this.path = path
        this.format = 'utf-8'
    }
    //2
    getProduct= () => {
        if (fs.existsSync(this.path)) {
         return fs.promises.readFile(this.path, this.format)
            .then(r => JSON.parse(r));
        } else {
          return [];
        }
      }
    //3
    addProduct = async(title,
        description ,
        price,
        thumbnail ,
        code ,
        stock)=>{
            const product = {
                id: this.getId(),
                title,
                description ,
                price,
                thumbnail ,
                code ,
                stock}
              
                const listProduct = await this.getProduct()

                if (listProduct.some(p => p.code === product.code)) {
                console.log(`Ya existe un producto con el código ${product.code}`);
                return null;
                    }

                listProduct.push(product);

                await fs.promises.writeFile(this.path, JSON.stringify(listProduct));

                console.log('Producto agregado correctamente.');
                return product;
                }
    //4          

    getId = ()=>{
      const count = this.getProduct.length
      if (count> 0) {
        return this.product[count -1].id + 1
      } else {
        return 1
      }
    }

 //manera async PRoblema para generar ID 
getId = async() => {
    const listProduct = await this.getProduct()
    const lastProduct = listProduct >0 ? lastProduct[listProduct.length -1].id : 0
    return lastProduct +1
}        

  getProductById(id){
      return this.getProduct()
              .then(listProduct => {
                const product = listProduct.find(p => p.id === id);
                return product ? product : null;
              })
              .catch(error => {
                console.error('Ocurrió un error al obtener los productos:', error);
                return null;
              })
  }
 //manera async del getProductsById problemas con el tiempo de ejecucion entre ambas funciones, siempre da resultado NULL


    updateProduct= () => {}
    deleteProduct= () => {}
}

const functionAsync = async() => {
const manager = new ProductManager('product.json')
 manager.addProduct("pruuba 1","prueb1", 23,"img",444,555)
 manager.addProduct("pruuba 2","prueb2", 23,"img",445,555)

/* console.log(await manager.getProduct())  */
console.log(await manager.getId())
console.log("este es el id", await manager.getProductById(1))

}


functionAsync ()