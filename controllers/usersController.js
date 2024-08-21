const db = require("../db/queries")

exports.homePageGet = async (req,res) => {
    console.log(req.body)
    res.render('index', {
        title: 'Home'
    })
}