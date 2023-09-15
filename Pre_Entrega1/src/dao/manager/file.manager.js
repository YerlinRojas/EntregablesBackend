import fs from 'fs';


export default class FileManager {
  constructor(filename = './db.json') {
    this.filename = filename; 
    
  }

  get = async () => {
    try {
      const fileContent = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      return [];
    }
  }

  write = async (data) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  getNextId = (list) => {
    return (list.length == 0) ? 1 : list[list.length - 1].id + 1
}

create = async (data) => {
  const list = await this.get()
  data.id = this.getNextId(list)
  list.push(data)
  await this.write(list); 
  return data; 
}

  getById = async (id) => {
    try {
        const data = await this.get(data)
        return data.find(d => d.id === id)
    } catch (error) {
        console.error(`Error get by ID: ${error}`);
    }
  }

  update = async (id, updatedFields) => {
    try {
      const list = await this.get()
      const idx = list.findIndex(d => d.id === id)
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updatedFields }; 
        await this.write(list);
        return true;
      }
      return false; 
    } catch (error) {
      console.error(`Error update: ${error}`);
    }
  }

  delete = async (id) => {
    try {
      const list = await this.get(); 
      const index = list.findIndex(cart => cart.id === id);

      if (index !== -1) {
        list.splice(index, 1); 
        await this.write(list); 
        return true;
      } 
      return false;
    } catch (error) {
      console.error(`Error deleting: ${error}`);
      throw error;
    }
  }

}
