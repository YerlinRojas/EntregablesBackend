import ChatModel from './models/chat.model'

export default class Chat {
    getChat = async () => {
        return await ChatModel.find()
    }
    
    createChat = async (data) => {
        return await ChatModel.create(data)
    }

    saveChat = async (chat) =>{
        return await chat.save()
    }
}