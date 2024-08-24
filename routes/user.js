const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController');
const passport = require("passport")

userRouter.get("/new", usersController.signupFormGet)
userRouter.post("/new", usersController.signupPost)

// for login
userRouter.get("/login", usersController.loginFormGet)

userRouter.post("/login", passport.authenticate(
    "local", { successRedirect: "/post/posts", 
        failureRedirect: "/user/login", failureMessage: true }),
        usersController.loginFormPost)


module.exports = userRouter