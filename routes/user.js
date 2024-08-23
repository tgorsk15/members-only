const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController');

userRouter.get("/new", usersController.signupFormGet)
userRouter.post("/new", usersController.signupPost)

// for login
userRouter.get("/login", usersController.loginFormGet)


module.exports = userRouter