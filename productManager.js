class ProductManager {
  constructor() {
    this.product = []
  }

  getProducts = () => {
    return this.product
  }
//Devuelv el arreglo buscado por id
  getProductsById = (productId) => {
    const findProduct = this.product.find(product => product.id === productId)
    if (findProduct) {
      console.log("este es tu product" , findProduct)
    } else { console.log ( " producto no existe")}
    return findProduct
  }

  //genera un id incrementable
  getID = ()=>{
    const count = this.product.length
    if (count> 0) {
      return this.product[count -1].id + 1
    } else {
      return 1
    }
  }

  addProducts = 
    (
    title,
    description ,
    price,
    thumbnail ,
    code ,
    stock ) =>  {
        //Campos del productmanager
        const product = {
            id : this.getID(),
            title,
            description,
            price : price ?? 200,
            thumbnail,
            code,
            stock : stock ?? 50 }
            

    //valida los cmpos obligatorios
    const camposObligatorios = (product.title.length === 0 ||product.description.length === 0 ||product.thumbnail.length === 0|| product.code.length === 0 );
      if (camposObligatorios) {
        console.log(`Todos los campos son obligatorios: title, description, price, thumbnail,code,stock`);
      return camposObligatorios
    } 


    //valida no repetir "CODE"
       const existingProduct = this.product.find(p => p.code === product.code);
    if (existingProduct) {
      console.log(`Ya existe un producto con el código ${product.code}`);
      return existingProduct
    }
    
        this.product.push(product)
            }
    
}


const manager = new ProductManager
manager.addProducts(1, "prueba1","prueba1",200, "imagen" ,"P001", 20); 
manager.addProducts("prueba2","prueba2",200, "imagen" ,"P001", 20); 
manager.addProducts("prueba3","prueba3",200, "" ,"P002", 20); 
manager.getProductsById(1)
/*  */
console.log(manager.getProducts())


