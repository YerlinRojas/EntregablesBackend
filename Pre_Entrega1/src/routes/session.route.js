import { Router } from "express";
import userModel from "../dao/models/user.model";

const router = Router ()

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })
    if(!user) return res.redirect('register')

    req.session.user = user
    
    return res.redirect('/products')
})



export default router