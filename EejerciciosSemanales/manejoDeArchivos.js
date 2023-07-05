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

const fs = require('fs')

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = 'utf-8'
  }

  getProduct = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises.readFile(this.path, this.format).then(r => JSON.parse(r))
    } else {
      return []
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const product = {
      id: await this.getId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const listProduct = await this.getProduct()

    if (listProduct.some(p => p.code === product.code)) {
      console.log(`Ya existe un producto con el código ${product.code}`)
      return null
    }

    listProduct.push(product);

    await fs.promises.writeFile(this.path, JSON.stringify(listProduct))

    console.log('Producto agregado correctamente.')
    return product;
  }

  getId = async () => {
    const listProduct = await this.getProduct()
    const lastProduct = listProduct.length > 0 ? listProduct[listProduct.length - 1].id : 0
    return lastProduct + 1
  }

  getProductById(id) {
    return this.getProduct()
      .then(listProduct => {
        const product = listProduct.find(p => p.id === id)
        return product ? product : null
      })
      .catch(error => {
        console.error('Ocurrió un error al obtener los productos:', error)
        return null
      });
  }

  updateProduct = async (id, updatedData) => {
    const listProduct = await this.getProduct()
    const productIndex = listProduct.findIndex(product => product.id === id)

    if (productIndex >0) {
      listProduct[productIndex] = {
        ...listProduct[productIndex],
        ...updatedData,
      }

      await fs.promises.writeFile(this.path, JSON.stringify(listProduct))

      console.log('Producto actualizado correctamente.')
      return listProduct[productIndex]
    } else {
      console.log('Producto no encontrado.')
      return null
    }
  }

  deleteProduct = async(id) => {
    const listProduct = await this.getProduct()
    const productIndex = listProduct.findIndex(product => product.id === id)

    if(productIndex >= 0) {
    listProduct.splice(productIndex, 1)
    await fs.promises.writeFile(this.path, JSON.stringify(listProduct))
    console.log("id producto eliminado:", productIndex +1) 
    return true
     
}else{
  console.log("no se encontro el producto a eliminar")
  return false
}
 


  };
}

const functionAsync = async () => {
  const manager = new ProductManager('product.json');
  await manager.addProduct('prueba 1', 'prueba1', 23, 'img', 444, 555);
  await manager.addProduct('prueba 2', 'prueba2', 23, 'img', 445, 555);

  console.log("Lista de productos: ", await manager.getProduct())
  console.log('Este es el producto: ', await manager.getProductById(1));

  const idAct = 2;
  const productUpdateData = {
    price: 5000,
    code: 500,
  };
  console.log(await manager.updateProduct(idAct, productUpdateData));

const productoEliminar = 1
console.log(await manager.deleteProduct(productoEliminar))

};

functionAsync();