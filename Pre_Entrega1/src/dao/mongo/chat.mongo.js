import ChatModel from '../mongo/models/chat.model.js'

export default class Chat {
    getChat = async () => {
        return await ChatModel.find().lean().exec()
    }
    
    createChat = async (data) => {
        return await ChatModel.create(data)
    }

    saveChat = async (chat) =>{
        return await chat.save()
    }
}