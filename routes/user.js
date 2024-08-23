const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController');

userRouter.get("/new", usersController.signupFormGet)
userRouter.post("/new", usersController.signupPost)


module.exports = userRouter