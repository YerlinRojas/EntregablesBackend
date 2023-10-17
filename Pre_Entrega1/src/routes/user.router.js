import { Router } from "express";
import {getUsers } from '../controller/user.controller.js'
const router = Router()

router.put('/premium/:ui', getUsers)
