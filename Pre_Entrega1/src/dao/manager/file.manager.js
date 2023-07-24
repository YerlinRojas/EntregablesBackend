import fs from 'fs';

export default class FileManager {
  constructor(filePath = './carts.json') {
    this.path = filePath;
  }

  read = async () => {
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

  getById = async (id) => {
    try {
        const data = await this.read(data)
        return data.find(d => d.id === id)
    } catch (error) {
        console.error(`Error al traer productID: ${error}`);
    }
  }

  update = async (data) => {
    try {
        const list = await this.read()
        const idx = list.findIndex (d => d.id === data.id)
        list[idx] = data
        return fs.promises.writeFile(this.path, JSON.stringify(data));
    } catch (error) {
        console.error(`Error al actualizar productID: ${error}`);
    }
  }
}