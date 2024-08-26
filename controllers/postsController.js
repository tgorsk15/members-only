const db = require("../db/queries")
const { body, validationResult } = require("express-validator")

const headerErr = "Message title needs to be anywhere from 2 and 50 characters"
const contentErr = "Message cannot be greater than 350 characters"

const validatePost = [
    body("postHeader").trim()
        .isLength({ min: 2, max: 50 }).withMessage(headerErr),
    body("postContent").trim()
        .isLength({ max: 350 }).withMessage(contentErr)
]


exports.postsBoardGet = async (req, res) => {
    let allPosts = await db.getAllPosts()

    await Promise.all(allPosts.map(async (post) => {
        const result = await db.getUserByPost(post.id)
        console.log(result)
        post.username = result.username
        console.log('new version', post)
    }))

    console.log('all posts', allPosts)

    console.log('here are posts')
    res.render("posts", {
        title: 'Posts',
        user: req.user,
        posts: allPosts
    })
}

exports.newPostGet = async (req, res) => {
    console.log('add your post')
    res.render("newPost", {
        title: 'New Message',
        user: req.user
    })
}

exports.newPostPost = [
    validatePost,
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("newPost", {
                    title: "New Message",
                    user: req.user,
                    errors: errors.array()
                })
            };
            const content = req.body
            console.log('post content', content)

            await db.insertNewPost(content.postHeader, content.postContent);
            // get newly created post from DB:
            const newPost = await db.getPostByTitle(content.postHeader);
            console.log(newPost);

            await db.insertNewReference(req.user.id, newPost.id)
            res.redirect("/post/posts")
        } catch(err) {
            console.log(err)
        }
        
    }
]

