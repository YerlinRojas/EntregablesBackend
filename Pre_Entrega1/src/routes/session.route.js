import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";



const router = Router()
//---------------------------------------------------
//LOGIN

router.post(
    '/login',
    passport.authenticate('login', '/products'),
    async (req, res) => {
        try {

            if (!req.user) return res.status(400)
            req.session.user = req.user
            return res.redirect('/products')

        } catch (error) {
            console.error('error al enviar login', error)
            return res.redirect('/login')
        }
    }
)

//REGISTER
router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }),
    async (req, res) => {
        try {
            res.redirect('/login')
        } catch (error) {
            console.error('error al registrar', error)
            return res.redirect('/register')
        }
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

//GITHUB---------------------------------------------------------------
router.get('/login-github', 

    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { })

router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            console.log('callback', req.user)
            req.session.user = req.user
            console.log(req.session)
            res.redirect('/')

        } catch (error) {
            console.error('error git call back', error)
        }

    }
)

export default router




//login sin passport
/* router.post('/login', async (req, res) => {
try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email})

    if (!user) {
        console.log("no se encontro user")
        return res.redirect('/register')
    }

    if(!isValidPassword(user, password)){ //se valida el hasheo
        console.log("password incorrect")
        return res.redirect('/login')
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

}) */


//---------------------------------------------------
//REGISTRO
/* router.post('/register', async (req, res) => {
    const user = req.body
    user.password = createHash (user.password) //hasheo de pass

    await userModel.create(user)
    user.role = 'usuario'

    console.log({user})

    return res.redirect('/')
}) */



