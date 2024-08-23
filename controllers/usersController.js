const db = require("../db/queries")
const bcrypt = require('bcryptjs')

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

exports.signupPost = async (req, res, next) => {
    // use passport to store user in session
    try {
        console.log(req.body)
        const userInfo = req.body
        userInfo.isMember = false
        userInfo.isAdmin = false
        console.log(userInfo)
        
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            console.log(hashedPassword)
            await db.insertNewUser(userInfo)
        })
    } catch(err) {

    }

    console.log('profile created')
}