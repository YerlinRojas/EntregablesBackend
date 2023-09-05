import { Router } from "express";
import { message, userNameChat, viewChat } from "../controller/chat.controller.js";
import { passportCall, authorization } from "../utils.js";

const router = Router ()

//username
router.get('/',
passportCall('jwt'),authorization('user'), viewChat)


//form enviar username
router.post('/username', userNameChat )

//form enviar nuevo mensaje
router.post('/message', message)

export default router