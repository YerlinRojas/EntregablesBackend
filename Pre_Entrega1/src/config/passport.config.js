import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github";
import config from "../config/config.js";

import { cookieExtractor, generateToken, createHash, isValidPassword } from "../utils.js";
import passportGoogle from "passport-google-oauth20";
import passportJWT from 'passport-jwt'


import { cartService, userService } from "../services/index.js";


const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const LocalStrategy = local.Strategy;
var GoogleStrategy = passportGoogle.Strategy;

console.log("PASSPORT CONFIG : ", config.PERSISTENCE);

const initializePassport = () => {


    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: config.PRIVATE_KEY
            },
            async (jwt_payload, done) => {

                try {
                    
                    return done(null, jwt_payload,jwt_payload.user, jwt_payload.cartId)
                } catch (e) {
                    return done(e)
                }
            })
    )



    
    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                callbackURL : config.GOOGLE_callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("PROFILE", profile);
                    const email = profile.emails[0].value;
                    const first_name = profile.displayName;

                    const user = await userService.getUser({ email });
                    if (user) {
                        
                        console.log("User already exits ");
                        const token = generateToken(user);
                        user.token = token;
                        return done(null, user)

                    }                        
                        let cart = new cartService.createCart()
                        const newCart = await cartService.saveCart(cart)
                        cart = newCart._id

                        const newUser = {
                            first_name: first_name,
                            last_name:profile._json.name,
                            age:"",
                            email: profile._json.email,
                            password: "",
                            rol: 'user',
                            cartId: cart,

                        }
                        const result = await userService.createUser(newUser);
                        console.log("New User Created GOOGLE:", result);

                        
                        const tokenPayload = { user: result, cartId: cart};
                        const token = generateToken(tokenPayload);
                        result.token= token

                        return done(null, result, { token });
                } catch (e) {
                    console.error("Error in Google Authentication:", error);
                    return done("error google auth", e);
                }
            }
        )
    );

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: config.GITHUB_CLIENT_ID,
                clientSecret: config.GITHUB_CLIENT_SECRET,
                callbackURL: config.GITHUB_callbackurl,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("PROFILE", profile);
                    const user = await userService.getUser({ email: profile._json.email });
                    if (user) {
                        console.log("Existing User:", user);
                        return done(null, user);
                    } 
                    let cart = new cartService.createCart()
                    const newCart = await cartService.saveCart(cart)
                    cart = newCart._id

                        const newUser = {
                            first_name: profile._json.displayName,
                            last_name:profile._json.name,
                            age:"",
                            email: profile._json.email,
                            password: "",
                            rol: 'user',
                            cartId: cart,
  
                        }
                        const result = await userService.createUser(newUser);
                        console.log("New User Created GITHUB:", result);

                        
                        const tokenPayload = { user: result, cartId: cart };
                        const token = generateToken(tokenPayload);
                        result.token= token
                        return done(null, result, { token });
                        
                        

                    
                } catch (e) {
                    console.error("Error in GitHub Authentication:", error);
                    return done("error github auth", e);
                }
            }
        )
    );
    //agregamos estrategias local
    // para google face etc
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                const { firts_name, last_name, age, email } = req.body;
                try {
                    const user = await userService.getUser({ email: username });
                    if (user) {
                        console.log("User already exits");
                        return done(null, false);
                    }
                    let cart = new cartService.createCart()
                        const newCart = await cartService.saveCart(cart)
                        cart = newCart._id

                    console.log('CART ID DESDE PASSPORT : ', cart)
                    const newUser = {
                        firts_name,
                        last_name,
                        age,
                        email,
                        password: createHash(password),
                        cartId: cart,

                    };
                    const result = await userService.createUser(newUser);
                    const tokenPayload = { user: result, cartId: cart };
                    const token = generateToken(tokenPayload);

                    return done(null, result, { token });
                    
                } catch (e) {
                    done("Error to register " + e);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userService.getUser({ email: username })
                        //.lean()
                        //.exec();
                        console.log('user desde login passport ' ,user);
                    if (!user) {
                        console.error("User doesnt exist");
                        return done(null, false);
                    }

                    if (!isValidPassword(user, password)) {
                        console.error("Password not valid");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (e) {
                    return done("Error login " + e);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userService.userById(id);
        done(null, user);
    });
};

export default initializePassport;
