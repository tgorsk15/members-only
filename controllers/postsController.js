const db = require("../db/queries")

exports.postsBoardGet = async (req, res) => {
    console.log('here are posts')
    res.render("posts", {
        title: 'Posts'
    })
}