import ChatDTO from '../dao/DTO/chat.dto.js'

export default class ChatRepository {
    constructor (dao) {
        this.dao = dao
    } 

    getChat = async () => {
        return await this.dao.getChat()
    }
    
    createChat = async (data) => {
        const newChat = new ChatDTO(data)
        return await this.dao.createChat(newChat)
    }

    saveChat = async (chat) =>{
        return await this.saveChat(chat)
    }
}