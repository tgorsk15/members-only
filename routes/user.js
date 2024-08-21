const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController');

userRouter.get("/new", usersController.signupFormGet)

module.exports = userRouter