import mongoose from 'mongoose'

const chatCollection = 'messages'

const chatSchema = new mongoose.Schema({
    user: String ,
    message : String
})

const chatModel = new mongoose.model(chatCollection, chatSchema)

export default chatModel