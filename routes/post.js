const { Router } = require('express');
const postRouter = Router();
const postsController = require('../controllers/postsController')

// main message board
postRouter.get("/posts", postsController.postsBoardGet)

// new post
postRouter.get("/newPost/:userId", postsController.newPostGet);
postRouter.post("/newPost/:userId", postsController.newPostPost);

// remove post
// postRouter.get("/removeMenu/:postId", postsController.removeMenuGet)
postRouter.get("/remove/:postId", postsController.removePostGet)

module.exports = postRouter