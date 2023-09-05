import fs from 'fs'

export default class ProductManager {
  constructor(path = './db.json') {
    this.path = path;
    this.format = 'utf-8'
  }

  
  getProduct = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises.readFile(this.path, this.format)
      .then(r => JSON.parse(r))
    } else {
      return []
    }
  };

  addProduct = async ({title, description, price, categeory, thumbnail, code, stock}) => {
    const product = {
      id: await this.getId(),
      title,
      description,
      price,
      categeory,
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

    if (productIndex >= 0) {
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
    const productIndex = listProduct.findIndex(product => product.id === parseInt(id))

if(productIndex >= 0) {
    listProduct.splice(productIndex, 1)
    await fs.promises.writeFile(this.path, JSON.stringify(listProduct)) 
    
    console.log("id producto eliminado:", productIndex +1) 
    return true
     
}else{
  console.log("no se encontro el producto a eliminar")
  return false
}
  }
}

