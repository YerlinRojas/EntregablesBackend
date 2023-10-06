import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github";
import config from "../config/config.js";
import {
    cookieExtractor,
    generateToken,
    createHash,
    isValidPassword,
} from "../utils.js";
import passportGoogle from "passport-google-oauth20";
import passportJWT from "passport-jwt";

import { logger } from "../logger.js";
import { cartService, userService } from "../services/index.js";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = local.Strategy;
var GoogleStrategy = passportGoogle.Strategy;

const initializePassport = () => {
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: config.PRIVATE_KEY,
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload, jwt_payload.user, jwt_payload.cartId);
                } catch (e) {
                    return done(e);
                }
            }
        )
    );

    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                callbackURL: config.GOOGLE_callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    logger.info("PROFILE GOOGLE EXTRACTOR OK", profile);
                    const email = profile.emails[0].value;
                    const first_name = profile.displayName;
                    const user = await userService.getUser({ email });
                    if (user) {
                        logger.error("User already exits ");
                        const token = generateToken(user);
                        user.token = token;
                        return done(null, user);
                    }
                    const cart = await cartService.createCart();
                    const newUser = {
                        first_name: first_name,
                        last_name: profile._json.name,
                        age: "",
                        email: profile._json.email,
                        password: "",
                        rol: "user",
                        cartId: cart._id,
                    };
                    const result = await userService.createUser(newUser);
                    logger.info("New User Created GOOGLE:", result);

                    const tokenPayload = { user: result, cartId: cart._id };
                    const token = generateToken(tokenPayload);
                    result.token = token;

                    return done(null, result, { token });
                } catch (e) {
                    logger.error("Error in Google Authentication:", error);
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
                    logger.info("PROFILE GITHUB EXTRACTOR OK", profile);
                    const user = await userService.getUser({
                        email: profile._json.email,
                    });
                    if (user) {
                        logger.error("Existing User:", user);
                        return done(null, user);
                    }

                    const cart = await cartService.createCart();

                    const newUser = {
                        first_name: profile._json.displayName,
                        last_name: profile._json.name,
                        age: "",
                        email: profile._json.email,
                        password: "",
                        rol: "user",
                        cartId: cart._id,
                    };
                    const result = await userService.createUser(newUser);
                    logger.info("New User Created GITHUB:", result);

                    const tokenPayload = { user: result, cartId: cart._id };
                    const token = generateToken(tokenPayload);
                    result.token = token;
                    return done(null, result, { token });
                } catch (e) {
                    logger.error("Error in GitHub Authentication:", e);
                    return done("error github auth", e);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                logger.info("Request body:", req.body);

                const { firts_name, last_name, age, email } = req.body;
                if (!req) {
                    return done("Invalid request object");
                }
                if (!req.body) {
                    return done("Request body is empty");
                }

                try {
                    const user = await userService.getUser({ email: username });
                    if (user) {
                        logger.error("User already exits:", user);
                        return done(null, false);
                    }
                    const cart = await cartService.createCart();

                    const newUser = {
                        firts_name,
                        last_name,
                        age,
                        email,
                        password: createHash(password),
                        cartId: cart._id,
                    };
                    const result = await userService.createUser(newUser);
                    const tokenPayload = { user: result, cartId: cart._id };
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
                    const user = await userService.getUser({ email: username });

                    if (!user) {
                        logger.error("User doesnt exist");
                        return done(null, false);
                    }

                    logger.info("Provided Password:", password);
                    logger.info("Stored Hashed Password:", user.password);

                    const passwordIsValid = isValidPassword(user, password);
                    logger.info("Password Is Valid:", passwordIsValid);

                    if (!isValidPassword(user, password)) {
                        logger.error("Password not valid");
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
