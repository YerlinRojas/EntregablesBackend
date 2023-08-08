import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router ()

//LOGIN
router.post('/login', async (req, res) => {
try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })
/* 
    if (!user) {
        return res.redirect('/register')
    }

    // Valida el admin
    if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
        user.role = 'admin'
    } else {
        user.role = 'user'
    }
 */
    // Asigna el usuario antes de guardarlo en la sesión
    req.session.user = user

    return res.redirect('/products')

} catch (error) {
    console.error('error al enviar login', error)
    return res.redirect('/')
}

    
})

//REGISTRO
router.post('/register', async (req, res) => {
    const user = req.body
    await userModel.create(user)
    user.role = 'usuario'

    console.log({user})

    return res.redirect('/')
})



//LOGOUT
router.get('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err)
        }


        res.redirect('/')
    })
})

export default router