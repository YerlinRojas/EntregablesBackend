import FileManager from "./file.manager.js";


export default class Product extends FileManager {
  constructor(filename = "./db.product.json") {
    super(filename)
  }

  getList =  async () => { return await this.get() }


  createProduct = async ({
    title,
    description,
    price,
    categeory,
    thumbnail,
    code,
    stock,
  }) => {
    const product = {
      id: await this.getById(),
      title,
      description,
      price,
      categeory,
      thumbnail,
      code,
      stock,
      owner: await this.getById()
    };

    const listProduct = await this.getList();
    if (listProduct.some((p) => p.code === product.code)) {
      console.log(`Product existing ${product.code}`);
      return null;
    }
    const createdProduct = await this.create(product); 
    if (createdProduct) {
      console.log("Product adding ");
      return createdProduct;
    } else {
      console.log("Error to add product");
      return null;
    }
  };


  productById= async (id) => {
    try{
      return await this.getById(id)
    }
      catch(error) {
        console.error("Error productById:", error);
        return null;
      };
  }

  updateProduct = async (id, updatedFields) => {
    try {
      updatedFields.id=id
      return await this.update(updatedFields)
    } catch (error) {
      console.log("Product no found");
      return null;
    }
   
  };

  deleteProduct = async (id) => { 
        try {
      const product = await this.getById(id);
      if (product) {
        await this.delete(id);
        console.log("Product deleted.");
        return true;
      } else {
        console.log("Product no found");
        return false;
      }
    } catch (error) {
      console.error("Error to deleted product:", error);
      return false;
}

}

}
