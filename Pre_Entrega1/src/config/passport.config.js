import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import UserModel from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";


const LocalStrategy = local.Strategy

const initializePassport = () => { 
    // GitHub login
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.043eb05662c99216',
            secret : '4053b445c53e5870baca83eb22eb129a279d04ff',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('GitHub Profile:', profile); 
            try {
                const user = userModel.findOne({ email: profile._json.email });
                if (user) {
                    console.log('Existing User:', user); 
                    return done(null, user);
                }
                const newUser = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                };
                const result = await userModel.create(newUser);
                console.log('New User Created:', result);
                return done(null, result);
            } catch (error) {
                console.error('Error in GitHub Authentication:', error); 
                return done('error github auth', error);
            }
        }
    ));
};
//agregamos estrategias local 
// para google face etc
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { firts_name,
                last_name,
                age, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    firts_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                done('Error to register ' + error)
            }
        }
    ))


    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                 return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })



export default initializePassport