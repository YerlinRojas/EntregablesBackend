import { chatService } from "../services/index.js" 

export const getChat = async (req,res)=>{
    try {
        
        const username = await chatService.getChat()
        logger.http('Solicitud HTTP exitosa en /api/chat/');
        res.render('chat',{username})
    } catch (error) {
        logger.error('Error preview chat', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const createUserNameChat = async(req,res)=>{
    try {
        const username = req.body
        const newUsername = await chatService.createChat(username)
        await chatService.saveChat(newUsername)
        logger.http('Solicitud HTTP exitosa en /api/chat/username');
        res.redirect('/chat')
    } catch (error) {
        logger.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}

export const message = async(req,res)=>{
    try {
        const newMessage = req.body
        const newMessageGenerated = await chatService.createChat(newMessage)
        await chatService.saveChat(newMessageGenerated)
        logger.http('Solicitud HTTP exitosa en /api/chat/message');
        res.redirect('/api/chat')
        
    } catch (error) {
        logger.error('Error send message', error)
        res.status(500).json({error : 'Internal server error'})
    }
}