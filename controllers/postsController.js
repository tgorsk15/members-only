const db = require("../db/queries")

exports.postsBoardGet = async (req, res) => {
    console.log('here are posts')
    console.log(req.user)
    res.render("posts", {
        title: 'Posts',
        user: req.user
    })
}

exports.newPostGet =async (req, res) => {
    console.log('add your post')
    console.log(req.user)
    res.render("newPost", {
        title: 'New Message',
        user: req.user
    })
}