import { chatService } from "../services/index.js" 

export const getChat = async (req,res)=>{
    try {
        
        const username = await chatService.getChat()
        
        res.render('chat',{username})
    } catch (error) {
        console.error('Error preview chat', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const createUserNameChat = async(req,res)=>{
    try {
        const username = req.body
        const newUsername = await chatService.createChat(username)
        await chatService.saveChat(newUsername)

        res.redirect('/chat')
    } catch (error) {
        console.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const message = async(req,res)=>{
    try {
        const newMessage = req.body
        const newMessageGenerated = await chatService.createChat(newMessage)
        await chatService.saveChat(newMessageGenerated)
        
        res.redirect('/api/chat')
        
    } catch (error) {
        console.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}