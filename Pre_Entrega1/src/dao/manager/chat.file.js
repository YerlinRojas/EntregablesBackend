import FileManager from './file.manager.js';

export default class Chat extends FileManager {
    constructor(filename = "./db.chat.json") {
        super(filename)
    }

    getChat = async () => { return await this.get() }

    createChat = async () => {
        const chat = {
            user,
            message: []
        }
        await this.write([...await this.get(), chat]);
        return chat;
    }

    saveChat = async (chat) => {
        try {
            const list = await this.get();
            const updatedList = list.map(item => {
                if (item.id === chat.id) {
                    return chat;
                }
                return item;
            });
            await this.write(updatedList);
            return chat;
        } catch (error) {
            console.error(`Error saving cart data: ${error}`);
            throw error;
        }
    }
}  
