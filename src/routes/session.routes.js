import { Router } from "express";
import { userDao } from "../mongo/user.dao.js";
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";
import { passportCall } from "../middleware/passport.middleware.js";
import { authorization } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  try {
    
    res.status(201).json({status: "success", msg: "Usuario Registrado"});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/login",passportCall("login"), async (req, res) => {
  try {

    const token = createToken(req.user)
    res.cookie("token" , token , {httpOnly: true})
    res.status(200).json({ status: "success", payload: req.user });

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: "success", msg: "Session cerrada" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/current",passportCall("jwt"),authorization("user"), async (req, res) => {
  try {
    const user =await userDao.getById(req.user.id)
    res.status(200).json({status: "success", payload: user })
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/google",
  passport.authenticate("google", { 
    scope:[
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false
    }),(req,res) =>{
      res.status(200).json({status: "success"})
    }
  )


export default router;
