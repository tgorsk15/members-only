const { Router } = require('express');
const postRouter = Router();
const postsController = require('../controllers/postsController')

// main message board
postRouter.get("/posts", postsController.postsBoardGet)

// new post
postRouter.get("/newPost/:userId", postsController.newPostGet)

module.exports = postRouter