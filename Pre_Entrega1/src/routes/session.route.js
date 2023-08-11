import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router ()
//---------------------------------------------------
//LOGIN
router.post('/login', async (req, res) => {
try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })

    if (!user) {
        return res.redirect('/register')
    }

    // Asigna el usuario antes de guardarlo en la sesión
    req.session.user = user
    const userName = await userModel.find(user)
    console.log('este es el usuario',userName)
  

    return res.send('/products', {user})
    //aca envio el USER--------------------

} catch (error) {
    console.error('error al enviar login', error)
    return res.redirect('/login')
}
    
})

//---------------------------------------------------
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


        res.redirect('/login')
    })
})

export default router