const { Router } = require('express');
const postRouter = Router();
const postsController = require('../controllers/postsController')

// main message board
postRouter.get("/posts", postsController.postsBoardGet)

module.exports = postRouter