
import chatModel from "../dao/models/chat.model.js";

export const viewChat = async (req,res)=>{
    try {
        
        const username = await chatModel.find().lean().exec()
        
        res.render('chat',{username})
    } catch (error) {
        console.error('Error preview chat', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const userNameChat = async(req,res)=>{
    try {
        const username = req.body
        const newUsername = new chatModel(username)
        await newUsername.save()

        res.redirect('/chat')
    } catch (error) {
        console.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const message = async(req,res)=>{
    try {
        const newMessage = req.body
        const newMessageGenerated = new chatModel(newMessage)
        await newMessageGenerated.save()
        
        res.redirect('/api/chat')
        
    } catch (error) {
        console.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}