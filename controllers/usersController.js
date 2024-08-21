const db = require("../db/queries")

exports.homePageGet = async (req,res) => {
    console.log(req.body)
    res.render('index', {
        title: 'Home'
    })
}

exports.signupFormGet = async (req, res) => {
    console.log('this is sign up function')
    res.render('signup', {
        title: 'Sign Up'
    })
}