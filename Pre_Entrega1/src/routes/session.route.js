import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { generateToken, passportCall, createHash, isValidPassword } from "../utils.js";
import passport from "passport";



const router = Router()
//---------------------------------------------------

router.get('/current', passportCall('jwt'), (req, res) => {
    console.log('Path /current')
    res.send({ status: 'success', payload: req.user })
})


//LOGIN
/* 
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
) */

//LOGIN JWT------------------------------
router.post(
    '/login',
    passport.authenticate('login', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const access_token = generateToken(req.user);

            res.cookie('coderCookie', access_token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            });

            res.redirect('/products');
        } catch (error) {
            console.error('error al registrar', error);
            return res.redirect('/register');
        }
    }
    );


//REGISTER
/* router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }),
    async (req, res) => {
        try {
            res.redirect('/login')
        } catch (error) {
            console.error('error al registrar', error)
            return res.redirect('/register')
        }
    })
 */

    
// REGISTER JWT------------
router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register' }),
    async (req, res) => {
        try {
            const access_token = generateToken(req.user);

            res.cookie('coderCookie', access_token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            });

            res.redirect('/login');
        } catch (error) {
            console.error('error al registrar', error);
            return res.redirect('/register');
        }
    }
);
//LOGOUT
/* router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err)
        }
        res.redirect('/login')
    })
}) */

router.get('/logout', (req, res) => {
    res.clearCookie('coderCookie'); 
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});



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



