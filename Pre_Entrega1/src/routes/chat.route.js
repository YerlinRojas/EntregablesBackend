import { Router } from "express";
import { message, createUserNameChat, getChat } from "../controller/chat.controller.js";
import { passportCall, authorization } from "../utils.js";

const router = Router ()

//username
router.get('/',
passportCall('jwt'),authorization('user'), getChat)


//form enviar username
router.post('/username',createUserNameChat )

//form enviar nuevo mensaje
router.post('/message', message)

export default router