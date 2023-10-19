import { Router } from "express";
import {getUsers } from '../controller/user.controller.js'
const router = Router()

router.post('/premium/:userId', getUsers)

export default router