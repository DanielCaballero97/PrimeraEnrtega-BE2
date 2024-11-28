import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20"
import { userDao } from "../mongo/user.dao.js";
import { createHash , isValidPassword} from "../utils/hashPassword.js";
import jwt from "passport-jwt"
import { cookieExtractor } from "../utils/cookiesExtractor.js";
import { createToken, verifyToken } from "../utils/jwt.js";
import { request, response } from "express";
import { cartDao } from "../mongo/cart.dao.js";


const LocalStrategy = local.Strategy;
const googleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {


  //estrategia de Registro de nuevos Usuarios , contempla el rol y todo
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {

        try {
          const { first_name, last_name, age ,role} = req.body;
          const user = await userDao.getByEmail(username);
          if (user)
            return done(null, false, { message: "El usuario ya existe" }); 

          const cart = await cartDao.create();

          const newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password),
            cart: cart._id,
            role: role ? role : "user"
          };

          const userRegister = await userDao.create(newUser);

          return done(null, userRegister);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  

  // estrategia de inicio de session 
  passport.use("login", new LocalStrategy({usernameField:"email"}, async (username , password , done) => {
      try {
        const user = await userDao.getByEmail(username);
        if (!user || !isValidPassword(password, user.password)) {
          return done (null , false, {message: "email o contra no valido"})
        }

        done(null , user)
        
      } catch (error) {
        done(error)
      }
      }
    )
  )


  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  //estrategia login desde google
  passport.use("google", new googleStrategy( { 
    clientID: "algo",
    clientSecret: "algo",

    callbackURL: "http://localhost:8080/sessions/google"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      console.log(profile)
      console.log("escuchan2")
      const { id, name, emails } = profile
      const user = {
        first_name: name.givenName,
        last_name: name.familyName,
        email: emails[0].value,
      }

      const existUser = await userDao.getByEmail(user.email) 

      if(existUser){
        return cb(null , existUser)
      }

      const newUser = await userDao.create(user);
      return cb(null, newUser)

    } catch (error) {
      return cb(error);
    }
   }
),


)
  // estrategia de JWT para los tokens
 passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: "Clave"
 },
 async (jwt_payload, done)=>{

    try {
      console.log(jwt_payload);
      return done(null , jwt_payload)

  } catch (error) {
      return done(error)
  }
 }
))


};
