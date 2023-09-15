import FileManager from './file.manager.js';

export default class User extends FileManager {
    constructor(filename = "./db.user.json") {
        super(filename)
    }

    getUser = async () => {
        return await this.get()
    }

    createUser = async () => {
        const user = {
            firts_name,
            last_name,
            age,
            email,
            cartId,
            role,
        }
        await this.write([...await this.get(), user]);
        return user;
    }

    userById = async (id) => {
        return await this.getById(id)
    }

    saveUser = async (user) => {
        try {
            const list = await this.get(); 
            const updatedList = list.map(item => {
                if (item.id === user.id) {
                    return user; 
                }
                return item;
            });
            await this.write(updatedList); 
            return user; 
        } catch (error) {
            console.error(`Error saving user data: ${error}`);
            throw error;
        }
      }


    updateUser = async (id, updateFields) => {
        updateFields.id = id
        return await this.update(id, updateFields)
    }

    deleteUser = async (id) => {
        try {
            return await this.delete(id)
        } catch (error) {
            console.log("User not found.");
            return false;

        }
    }

}