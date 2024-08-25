const db = require("../db/queries")

exports.postsBoardGet = async (req, res) => {
    const allPosts = await db.getAllPosts()
    console.log(allPosts)

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

exports.newPostPost = async (req, res) => {
    console.log('this has posted')
    const content = req.body
    console.log(content)
    

    await db.insertNewPost(content.postHeader, content.postContent);
    // get newly created post from DB:
    const newPost = await db.getPostByTitle(content.postHeader);
    console.log(newPost);

    await db.insertNewReference(req.user.id, newPost.id)
    res.redirect("/post/posts")
}