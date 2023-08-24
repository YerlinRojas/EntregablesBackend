import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import passportGoogle from 'passport-google-oauth20'

const LocalStrategy = local.Strategy;
var GoogleStrategy = passportGoogle.Strategy;

const GOOGLE_CLIENT_ID = '734120610990-ku3motded52vltvaaufu3h17qvcboptj.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET ='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'

const initializePassport = () => {

    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/callback-google"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                    console.log(profile)

            const email = profile.emails[0].value
            const name = profile.displayName

            const user = await userModel.findOne({ email })
            if(user) {
                console.log("Existing User:", user);
                return done(null, user)
            }            

            const result = await userModel.create({ email, name, password: '' });

            return done(null, result)
            } catch (error) {
                console.error("Error in Google Authentication:", error);
                return done("error google auth", error);
            }
        
        }
    ));




    passport.use('github',
        new GitHubStrategy(
            {
                clientID: "Iv1.043eb05662c99216",
                clientSecret: "4053b445c53e5870baca83eb22eb129a279d04ff",
                callbackURL: "http://127.0.0.1:8080/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log('PROFILE',profile)
                    const user = await userModel.findOne({ email: profile._json.email });
                    if (user) {
                        console.log("Existing User:", user);
                        return done(null, user);
                    }
                    const newUser = {
                        first_name: profile._json.name,
                        email: profile._json.email,
                        password: "",
                    };
                    const result = await userModel.create(newUser);
                    console.log("New User Created:", result);
                    return done(null, result);
                } catch (error) {
                    console.error("Error in GitHub Authentication:", error);
                    return done("error github auth", error);
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
                    const user = await UserModel.findOne({ email: username });
                    if (user) {
                        console.log("User already exits");
                        return done(null, false);
                    }

                    const newUser = {
                        firts_name,
                        last_name,
                        age,
                        email,
                        password: createHash(password),
                    };
                    const result = await UserModel.create(newUser);
                    return done(null, result);
                } catch (e) {
                    done("Error to register " + error);
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
                    const user = await UserModel.findOne({ email: username })
                        .lean()
                        .exec();
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
                    return done("Error login " + error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
};

export default initializePassport;
