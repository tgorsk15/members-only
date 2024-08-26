const db = require("../db/queries")

exports.postsBoardGet = async (req, res) => {
    let allPosts = await db.getAllPosts()

    await Promise.all(allPosts.map(async (post) => {
        const result = await db.getUserByPost(post.id)
        console.log(result)
        post.username = result.username
        console.log('new version', post)
    }))

    // allPosts.forEach(async (post) => {
        
    // });
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